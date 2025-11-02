"""
Pronote Python Service Wrapper
Provides utilities to call the Python pronote_sync.py script from Node.js
"""
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from pronote_sync import ent_login_and_get_session, fetch_pronote_data, safe_serialize

__all__ = ['ent_login_and_get_session', 'fetch_pronote_data', 'safe_serialize']
