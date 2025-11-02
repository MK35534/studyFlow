#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mark homework as done on Pronote
Usage: python mark_homework_done.py <pronote_url> <username> <password> <homework_id> <done_status>
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


def ent_login_and_get_session(pronote_url, username, password, timeout=30):
    """
    Perform ENT/CAS login (GET then POST) and return (final_url, cookiejar)
    """
    cas_login = f"https://www.atrium-sud.fr/connexion/login?service={quote_plus(pronote_url)}"
    sess = requests.Session()
    
    print('[ENT] GET', cas_login, file=sys.stderr)
    r = sess.get(cas_login, timeout=timeout)
    r.raise_for_status()
    
    soup = BeautifulSoup(r.text, 'html.parser')
    form = soup.find('form', {'id': 'fm1'})
    if not form:
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


def mark_homework(pronote_session_url, username, password, cookiejar, homework_title, homework_due_date, homework_subject, done_status):
    """
    Mark a specific homework as done or undone on Pronote
    
    Args:
        pronote_session_url: Pronote session URL after ENT auth
        username: Pronote username
        password: Pronote password
        cookiejar: Cookies from ENT authentication
        homework_title: Title/description of the homework
        homework_due_date: Due date (YYYY-MM-DD)
        homework_subject: Subject name
        done_status: True to mark as done, False to mark as undone
    
    Returns:
        dict: Success status
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
        uuid='studyflow-mark-homework'
    )
    
    print(f'[pronotepy] Logged in: {getattr(client, "logged_in", "unknown")}', file=sys.stderr)

    # Parse due date
    try:
        due_date = datetime.strptime(homework_due_date, '%Y-%m-%d').date()
    except:
        due_date = None
    
    # Search around the due date (2 weeks before to 2 weeks after)
    if due_date:
        search_start = datetime.combine(due_date - timedelta(weeks=2), datetime.min.time())
        search_end = datetime.combine(due_date + timedelta(weeks=2), datetime.min.time())
    else:
        today = datetime.today()
        search_start = today - timedelta(weeks=4)
        search_end = today + timedelta(weeks=8)

    # Find the homework by title, date and subject
    print(f'[pronotepy] Searching for homework:', file=sys.stderr)
    print(f'  - Title: {homework_title}', file=sys.stderr)
    print(f'  - Due: {homework_due_date}', file=sys.stderr)
    print(f'  - Subject: {homework_subject}', file=sys.stderr)
    print(f'[pronotepy] Search range: {search_start.date()} to {search_end.date()}', file=sys.stderr)
    
    found_homework = None
    current_date = search_start
    
    # Normalize search terms
    title_normalized = homework_title.lower().strip()
    subject_normalized = homework_subject.lower().replace('-', ' ').replace('_', ' ').strip()
    
    # Try to get ALL homework at once using date range
    print(f'[pronotepy] Fetching all homework in range...', file=sys.stderr)
    try:
        # Method 1: Try with date range
        try:
            all_homework = client.homework(search_start, search_end)
        except TypeError:
            # Method 2: Try with just start date
            try:
                all_homework = client.homework(search_start)
            except Exception:
                all_homework = []
        
        print(f'[pronotepy] Retrieved {len(all_homework) if hasattr(all_homework, "__len__") else "?"} total homework items', file=sys.stderr)
        
        if hasattr(all_homework, '__iter__') and not isinstance(all_homework, (str, bytes, dict)):
            for h in all_homework:
                try:
                    # Get homework details
                    h_desc = str(getattr(h, 'description', '')).lower().strip()
                    h_subject = str(getattr(h, 'subject', '')).lower().replace('-', ' ').replace('_', ' ').strip()
                    
                    # Match by title similarity and subject
                    title_match = title_normalized in h_desc or h_desc in title_normalized
                    subject_match = subject_normalized in h_subject or h_subject in subject_normalized
                    
                    if title_match and subject_match:
                        found_homework = h
                        print(f'[pronotepy] ✓ Found homework match!', file=sys.stderr)
                        print(f'  - Description: {h.description}', file=sys.stderr)
                        print(f'  - Subject: {h.subject}', file=sys.stderr)
                        break
                except Exception as inner_e:
                    print(f'[pronotepy] Error processing homework: {inner_e}', file=sys.stderr)
                    continue
    except Exception as e:
        print(f'[pronotepy] Failed to fetch homework: {e}', file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
    
    if not found_homework:
        return {
            'success': False,
            'error': f'Homework not found (title: {homework_title}, subject: {homework_subject}, due: {homework_due_date})'
        }
    
    # Mark homework as done/undone
    try:
        print(f'[pronotepy] Marking homework as {"done" if done_status else "undone"}...', file=sys.stderr)
        found_homework.set_done(done_status)
        print('[pronotepy] Homework marked successfully', file=sys.stderr)
        
        return {
            'success': True,
            'message': f'Homework marked as {"done" if done_status else "undone"}'
        }
    except Exception as e:
        print(f'[pronotepy] Error marking homework: {e}', file=sys.stderr)
        return {
            'success': False,
            'error': str(e)
        }


def main():
    """
    Main function: mark homework as done/undone on Pronote
    
    Expected args: python mark_homework_done.py <pronote_url> <username> <password> <title> <due_date> <subject> <done_status>
    """
    if len(sys.argv) != 8:
        print(json.dumps({
            'success': False,
            'error': 'Usage: mark_homework_done.py <pronote_url> <username> <password> <title> <due_date> <subject> <done_status>'
        }))
        sys.exit(1)
    
    pronote_url = sys.argv[1]
    username = sys.argv[2]
    password = sys.argv[3]
    homework_title = sys.argv[4]
    homework_due_date = sys.argv[5]
    homework_subject = sys.argv[6]
    done_status = sys.argv[7].lower() in ['true', '1', 'yes']
    
    try:
        # Step 1: ENT Login
        print('[StudyFlow] Starting ENT authentication...', file=sys.stderr)
        final_url, jar = ent_login_and_get_session(pronote_url, username, password)
        
        # Step 2: Mark homework
        print('[StudyFlow] Marking homework...', file=sys.stderr)
        result = mark_homework(final_url, username, password, jar, homework_title, homework_due_date, homework_subject, done_status)
        
        # Step 3: Output JSON result
        print(json.dumps(result, ensure_ascii=False))
        sys.exit(0 if result['success'] else 1)
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
