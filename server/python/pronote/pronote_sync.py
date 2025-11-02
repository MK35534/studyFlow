#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pronote ENT Sync Service for StudyFlow
Authenticates via ENT (CAS) and fetches homework data using pronotepy
Returns JSON with lessons, homework, and grades
"""

import os
import json
import sys
import io
from datetime import datetime, timedelta, date
from bs4 import BeautifulSoup
import requests
from urllib.parse import quote_plus

# Force UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def safe_serialize(obj):
    """Convert pronotepy objects to JSON-serializable format"""
    # Primitives
    if obj is None or isinstance(obj, (str, int, float, bool)):
        return obj
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    # Lists/tuples/sets
    if isinstance(obj, (list, tuple, set)):
        return [safe_serialize(o) for o in obj]
    # Dicts
    if isinstance(obj, dict):
        return {k: safe_serialize(v) for k, v in obj.items()}
    # Objects with to_dict
    if hasattr(obj, 'to_dict') and callable(getattr(obj, 'to_dict')):
        try:
            return safe_serialize(obj.to_dict())
        except Exception:
            pass
    # Objects with __dict__
    if hasattr(obj, '__dict__'):
        try:
            return safe_serialize(vars(obj))
        except Exception:
            pass
    # Fallback: string repr
    try:
        return str(obj)
    except Exception:
        return None


def ent_login_and_get_session(pronote_url, username, password, timeout=30):
    """
    Perform ENT/CAS login (GET then POST) and return (final_url, cookiejar)
    
    Args:
        pronote_url: URL of the Pronote instance
        username: ENT username
        password: ENT password
        timeout: Request timeout in seconds
    
    Returns:
        tuple: (final_pronote_url, requests.cookies.RequestsCookieJar)
    """
    cas_login = f"https://www.atrium-sud.fr/connexion/login?service={quote_plus(pronote_url)}"
    sess = requests.Session()
    
    print('[ENT] GET', cas_login, file=sys.stderr)
    r = sess.get(cas_login, timeout=timeout)
    r.raise_for_status()
    
    soup = BeautifulSoup(r.text, 'html.parser')
    form = soup.find('form', {'id': 'fm1'})
    if not form:
        # Fallback: try first form
        form = soup.find('form')
        if not form:
            raise RuntimeError('Login form not found on ENT page')

    payload = {}
    for input_ in form.find_all('input'):
        name = input_.get('name')
        if not name:
            continue
        payload[name] = input_.get('value', '')
    
    payload['username'] = username
    payload['password'] = password

    print('[ENT] POST credentials', file=sys.stderr)
    r2 = sess.post(r.url, data=payload, allow_redirects=True, timeout=timeout)
    final_url = r2.url
    
    print(f'[ENT] Final URL: {final_url}', file=sys.stderr)
    print(f'[ENT] Cookies: {len(sess.cookies)} cookies captured', file=sys.stderr)

    jar = requests.cookies.RequestsCookieJar()
    jar.update(sess.cookies)
    return final_url, jar


def fetch_pronote_data(pronote_session_url, username, password, cookiejar, pending_actions=None):
    """
    Fetch homework, lessons, and grades from Pronote using pronotepy
    
    Args:
        pronote_session_url: Pronote session URL after ENT auth
        username: Pronote username
        password: Pronote password
        cookiejar: Cookies from ENT authentication
        pending_actions: List of pending actions to execute (optional)
    
    Returns:
        dict: Contains 'lessons', 'homework', 'grades', and 'processed_actions'
    """
    from pronotepy.clients import Client

    def ent_stub(u, p, url=None, **opts):
        """Stub function for pronotepy ENT authentication"""
        print('[pronotepy] ent_stub called', file=sys.stderr)
        return cookiejar

    print('[pronotepy] Creating Client...', file=sys.stderr)
    client = Client(
        pronote_session_url,
        username,
        password,
        ent=ent_stub,
        mode='normal',
        uuid='studyflow-sync'
    )
    
    print(f'[pronotepy] Logged in: {getattr(client, "logged_in", "unknown")}', file=sys.stderr)

    data = {}
    
    # Calculate school year dates
    today = datetime.today()
    year = today.year
    sept_first = date(year, 9, 1)
    
    if today.date() < sept_first:
        school_start = date(year - 1, 9, 1)
        school_end = date(year, 8, 31)
    else:
        school_start = date(year, 9, 1)
        school_end = date(year + 1, 8, 31)

    # Fetch lessons (timetable)
    try:
        print('[pronotepy] Fetching timetable...', file=sys.stderr)
        first_week = client.get_week(datetime.combine(school_start, datetime.min.time()))
        last_week = client.get_week(datetime.combine(school_end, datetime.min.time()))
        
        all_lessons = []
        for w in range(first_week, last_week + 1):
            try:
                week_date = school_start + timedelta(weeks=(w - first_week))
                lessons = client.lessons(week_date)
                for lesson in lessons:
                    all_lessons.append(safe_serialize(lesson))
            except Exception as e:
                # Skip failed weeks
                print(f'[pronotepy] Week {w} failed: {e}', file=sys.stderr)
                continue
        
        data['lessons'] = all_lessons
        print(f'[pronotepy] Timetable: {len(all_lessons)} lessons', file=sys.stderr)
    except Exception as e:
        print(f'[pronotepy] Timetable fetch failed: {e}', file=sys.stderr)
        data['lessons'] = []

    # Fetch homework
    try:
        if hasattr(client, 'homework'):
            print('[pronotepy] Fetching homework...', file=sys.stderr)
            homeworks = []
            first_week = client.get_week(datetime.combine(school_start, datetime.min.time()))
            last_week = client.get_week(datetime.combine(school_end, datetime.min.time()))
            
            for w in range(first_week, last_week + 1):
                try:
                    week_date = school_start + timedelta(weeks=(w - first_week))
                    try:
                        hw = client.homework(week_date)
                    except TypeError:
                        try:
                            hw = client.homework(week_date, week_date + timedelta(days=7))
                        except Exception:
                            hw = []
                    
                    if hasattr(hw, '__iter__') and not isinstance(hw, (str, bytes, dict)):
                        for h in hw:
                            homeworks.append(safe_serialize(h))
                    else:
                        if hw:
                            homeworks.append(safe_serialize(hw))
                except Exception as e:
                    print(f'[pronotepy] Week {w} homework failed: {e}', file=sys.stderr)
                    continue
            
            data['homework'] = homeworks
            print(f'[pronotepy] Homework: {len(homeworks)} assignments', file=sys.stderr)
            
            # Process pending actions if provided
            if pending_actions and len(pending_actions) > 0:
                print(f'[pronotepy] Processing {len(pending_actions)} pending actions...', file=sys.stderr)
                processed_actions = []
                
                for action in pending_actions:
                    try:
                        action_id = action.get('id')
                        action_type = action.get('action_type')
                        pronote_id = action.get('pronote_id')
                        
                        # Find homework by pronote_id in the fetched homework
                        found_hw = None
                        for hw_data in homeworks:
                            if str(hw_data.get('id', '')) == str(pronote_id):
                                # We have the serialized data, need to get actual homework object
                                # Re-fetch to get the live object
                                for w in range(first_week, last_week + 1):
                                    try:
                                        week_date = school_start + timedelta(weeks=(w - first_week))
                                        try:
                                            hw_list = client.homework(week_date)
                                        except TypeError:
                                            hw_list = client.homework(week_date, week_date + timedelta(days=7))
                                        
                                        if hasattr(hw_list, '__iter__'):
                                            for hw_obj in hw_list:
                                                if str(getattr(hw_obj, 'id', '')) == str(pronote_id):
                                                    found_hw = hw_obj
                                                    break
                                        if found_hw:
                                            break
                                    except Exception:
                                        continue
                                break
                        
                        if found_hw:
                            # Execute the action
                            if action_type == 'mark_done':
                                found_hw.set_done(True)
                                print(f'[pronotepy] ✓ Marked homework {pronote_id} as done', file=sys.stderr)
                            elif action_type == 'mark_undone':
                                found_hw.set_done(False)
                                print(f'[pronotepy] ✓ Marked homework {pronote_id} as undone', file=sys.stderr)
                            
                            processed_actions.append({
                                'id': action_id,
                                'success': True
                            })
                        else:
                            print(f'[pronotepy] ✗ Homework {pronote_id} not found for action {action_id}', file=sys.stderr)
                            processed_actions.append({
                                'id': action_id,
                                'success': False,
                                'error': 'Homework not found'
                            })
                    except Exception as e:
                        print(f'[pronotepy] ✗ Action {action_id} failed: {e}', file=sys.stderr)
                        processed_actions.append({
                            'id': action_id,
                            'success': False,
                            'error': str(e)
                        })
                
                data['processed_actions'] = processed_actions
                print(f'[pronotepy] Processed {len(processed_actions)} actions', file=sys.stderr)
    except Exception as e:
        print(f'[pronotepy] Homework fetch failed: {e}', file=sys.stderr)
        data['homework'] = []

    # Fetch grades
    try:
        print('[pronotepy] Fetching grades...', file=sys.stderr)
        grades_by_period = {}
        try:
            periods = client.periods
            for p in periods:
                try:
                    g = p.grades
                    grades_by_period[p.name] = safe_serialize(g)
                except Exception as e:
                    print(f'[pronotepy] Period {p.name} grades failed: {e}', file=sys.stderr)
                    grades_by_period[p.name] = None
            
            data['grades'] = grades_by_period
            print(f'[pronotepy] Grades: {len(grades_by_period)} periods', file=sys.stderr)
        except Exception as e:
            # Fallback: try client.info if available
            if hasattr(client, 'info'):
                info = client.info
                data['info'] = safe_serialize(info)
                print('[pronotepy] Info retrieved as fallback', file=sys.stderr)
    except Exception as e:
        print(f'[pronotepy] Grades fetch failed: {e}', file=sys.stderr)
        data['grades'] = {}

    return data


def main():
    """
    Main function: reads credentials from args, performs ENT login,
    fetches Pronote data, and outputs JSON to stdout
    
    Expected args: python pronote_sync.py <pronote_url> <username> <password> [pending_actions_json]
    """
    if len(sys.argv) < 4:
        print(json.dumps({
            'success': False,
            'error': 'Usage: pronote_sync.py <pronote_url> <username> <password> [pending_actions_json]'
        }))
        sys.exit(1)
    
    pronote_url = sys.argv[1]
    username = sys.argv[2]
    password = sys.argv[3]
    pending_actions = None
    
    # Optional: parse pending actions JSON
    if len(sys.argv) >= 5:
        try:
            pending_actions = json.loads(sys.argv[4])
            print(f'[StudyFlow] Received {len(pending_actions)} pending actions', file=sys.stderr)
        except Exception as e:
            print(f'[StudyFlow] Failed to parse pending actions: {e}', file=sys.stderr)
    
    try:
        # Step 1: ENT Login
        print('[StudyFlow] Starting ENT authentication...', file=sys.stderr)
        final_url, jar = ent_login_and_get_session(pronote_url, username, password)
        
        # Step 2: Fetch Pronote data and process pending actions
        print('[StudyFlow] Fetching Pronote data...', file=sys.stderr)
        data = fetch_pronote_data(final_url, username, password, jar, pending_actions)
        
        # Step 3: Output JSON result
        output = {
            'success': True,
            'generated_by': 'pronote_sync.py',
            'generated_at': datetime.utcnow().isoformat() + 'Z',
            'data': data
        }
        
        # Output to stdout (Node.js will capture this)
        print(json.dumps(output, ensure_ascii=False, indent=2))
        print('[StudyFlow] Sync completed successfully', file=sys.stderr)
        
    except Exception as e:
        error_output = {
            'success': False,
            'error': str(e),
            'error_type': type(e).__name__
        }
        print(json.dumps(error_output, ensure_ascii=False, indent=2))
        print(f'[StudyFlow] Sync failed: {type(e).__name__}: {e}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
