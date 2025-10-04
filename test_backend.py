"""
Simple test script to verify the backend is working
Run this while the server is running: python test_backend.py
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health():
    print_section("TEST 1: Health Check")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_list_agents():
    print_section("TEST 2: List Agents")
    try:
        response = requests.get(f"{BASE_URL}/api/agents", timeout=5)
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        print(f"\n✅ Found {len(data['agents'])} agents")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_single_agent():
    print_section("TEST 3: Sales Agent (Tests Fake Data)")
    print("Asking: 'What is our current revenue performance?'")
    print("This should reference data from server/data/sales_data.py")
    print("\nWaiting for response (takes ~5 seconds)...")

    try:
        response = requests.post(
            f"{BASE_URL}/api/agent/sales/ask",
            json={"question": "What is our current revenue performance?"},
            timeout=30
        )
        print(f"\nStatus Code: {response.status_code}")
        data = response.json()
        print(f"\nAgent: {data.get('agent')}")
        print(f"Role: {data.get('role')}")
        print(f"\nResponse:\n{data.get('response')}")

        # Check if it mentions the fake data
        response_text = data.get('response', '').lower()
        if '2,450,000' in response_text or '2.45' in response_text or '2450000' in response_text:
            print("\n✅ Agent correctly referenced fake sales data!")
        else:
            print("\n⚠️  Agent responded but didn't mention specific revenue numbers")

        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_quick_discussion():
    print_section("TEST 4: Quick Advisory Board Discussion")
    print("Asking: 'What is our revenue performance?'")
    print("This will get responses from all 3 agents")
    print("\nWaiting for response (takes ~10-15 seconds)...")

    try:
        response = requests.post(
            f"{BASE_URL}/api/advisory-board/quick-discuss",
            json={
                "question": "What is our revenue performance?",
                "include_research": False  # Skip web search to be faster
            },
            timeout=60
        )
        print(f"\nStatus Code: {response.status_code}")
        data = response.json()

        print(f"\nQuestion: {data.get('question')}")
        print(f"Mode: {data.get('mode')}")
        print(f"\nAgent Responses:")

        for agent in data.get('agents', []):
            print(f"\n--- {agent['agent']} ---")
            print(f"{agent['response'][:200]}...")

        print(f"\n✅ Got responses from {len(data.get('agents', []))} agents")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("\n" + "🚀"*30)
    print("  AI Agent Advisory Board - Backend Test")
    print("🚀"*30)
    print("\nMake sure the server is running: npm run fastapi")
    print("Press Ctrl+C to cancel, or Enter to start tests...")
    input()

    results = []

    # Test 1: Health
    results.append(("Health Check", test_health()))
    time.sleep(1)

    # Test 2: List Agents
    results.append(("List Agents", test_list_agents()))
    time.sleep(1)

    # Test 3: Single Agent
    results.append(("Sales Agent", test_single_agent()))
    time.sleep(1)

    # Test 4: Quick Discussion
    results.append(("Quick Discussion", test_quick_discussion()))

    # Summary
    print_section("SUMMARY")
    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")

    print(f"\n{passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed! Your backend is working correctly!")
        print("\nNext steps:")
        print("1. Try the full discussion: /api/advisory-board/discuss")
        print("2. Visit http://localhost:8000/docs for interactive API docs")
        print("3. Enable Airia by setting USE_AIRIA_ORCHESTRATION=true in .env")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")
        print("\nCommon issues:")
        print("- Make sure .env file is in the server/ directory")
        print("- Verify your API keys are correct")
        print("- Check the server logs for errors")

if __name__ == "__main__":
    main()
