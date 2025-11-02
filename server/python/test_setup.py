#!/usr/bin/env python3
"""
Test script to verify Pronote sync setup
Run: python test_setup.py
"""

import sys

def test_imports():
    """Test if all required modules can be imported"""
    print("🧪 Testing Python imports...")
    
    required_modules = {
        'pronotepy': 'pronotepy',
        'bs4': 'beautifulsoup4',
        'requests': 'requests',
        'dotenv': 'python-dotenv'
    }
    
    all_ok = True
    
    for module_name, package_name in required_modules.items():
        try:
            __import__(module_name)
            print(f"  ✅ {package_name}")
        except ImportError:
            print(f"  ❌ {package_name} - Not installed")
            all_ok = False
    
    return all_ok


def test_pronote_sync_script():
    """Test if pronote_sync.py can be imported"""
    print("\n🧪 Testing pronote_sync.py...")
    
    try:
        import pronote_sync
        print("  ✅ pronote_sync.py can be imported")
        
        # Check if main functions exist
        required_functions = ['main', 'ent_login_and_get_session', 'fetch_pronote_data', 'safe_serialize']
        for func_name in required_functions:
            if hasattr(pronote_sync, func_name):
                print(f"  ✅ Function '{func_name}' exists")
            else:
                print(f"  ❌ Function '{func_name}' not found")
                return False
        
        return True
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("🐍 StudyFlow Pronote Python Setup Test")
    print("=" * 60)
    
    tests_passed = 0
    tests_total = 2
    
    # Test 1: Imports
    if test_imports():
        tests_passed += 1
    
    # Test 2: Script
    if test_pronote_sync_script():
        tests_passed += 1
    
    # Summary
    print("\n" + "=" * 60)
    if tests_passed == tests_total:
        print(f"✅ All tests passed! ({tests_passed}/{tests_total})")
        print("\n🎉 Python environment is ready for Pronote sync!")
        print("\nNext steps:")
        print("  1. Configure Pronote credentials in StudyFlow")
        print("  2. Click 'Synchroniser' in the app")
        print("  3. Check the sync logs")
        sys.exit(0)
    else:
        print(f"❌ Some tests failed ({tests_passed}/{tests_total})")
        print("\n📦 To install missing dependencies, run:")
        print("  pip install -r requirements.txt")
        sys.exit(1)


if __name__ == '__main__':
    main()
