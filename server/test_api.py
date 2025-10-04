"""
Simple test script to verify the API is working correctly
Run this after starting the server to test all endpoints
"""
import asyncio
import httpx
import json

BASE_URL = "http://localhost:8000"

async def test_health():
    """Test health endpoint"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/health")
        print("✓ Health Check:", response.json())
        return response.status_code == 200

async def test_list_agents():
    """Test listing agents"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/api/agents")
        data = response.json()
        print(f"✓ Available Agents ({len(data['agents'])}):")
        for agent in data['agents']:
            print(f"  - {agent['name']} ({agent['role']})")
        return response.status_code == 200

async def test_single_agent():
    """Test asking a single agent"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/api/agent/sales/ask",
            json={"question": "What is our current revenue performance?"},
            timeout=30.0
        )
        data = response.json()
        print(f"\n✓ Sales Agent Response:")
        print(f"  Agent: {data['agent']}")
        print(f"  Response: {data['response'][:200]}...")
        return response.status_code == 200

async def test_advisory_board():
    """Test full advisory board discussion"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/api/advisory-board/discuss",
            json={
                "question": "How can we improve customer retention?",
                "include_research": True
            },
            timeout=60.0
        )
        data = response.json()
        print(f"\n✓ Advisory Board Discussion:")
        print(f"  Question: {data['question']}")
        print(f"  Agents responded: {len(data['agents'])}")
        for agent in data['agents']:
            print(f"\n  {agent['agent']}:")
            print(f"    {agent['response'][:150]}...")

        if data.get('synthesis'):
            print(f"\n  Synthesis:")
            print(f"    {data['synthesis'][:200]}...")

        return response.status_code == 200

async def main():
    """Run all tests"""
    print("=" * 60)
    print("Testing AI Agent Advisory Board API")
    print("=" * 60)
    print()

    tests = [
        ("Health Check", test_health),
        ("List Agents", test_list_agents),
        ("Single Agent Query", test_single_agent),
        ("Full Advisory Board Discussion", test_advisory_board)
    ]

    results = []
    for name, test_func in tests:
        print(f"\n{'=' * 60}")
        print(f"Test: {name}")
        print('=' * 60)
        try:
            success = await test_func()
            results.append((name, success))
        except Exception as e:
            print(f"✗ Error: {e}")
            results.append((name, False))

    print(f"\n{'=' * 60}")
    print("Test Results Summary")
    print('=' * 60)
    for name, success in results:
        status = "✓ PASSED" if success else "✗ FAILED"
        print(f"{status}: {name}")

    all_passed = all(success for _, success in results)
    if all_passed:
        print("\n🎉 All tests passed! Your API is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    print("Make sure the server is running on http://localhost:8000")
    print("Start server with: uvicorn main:app --reload --port 8000")
    print()
    input("Press Enter to run tests...")
    asyncio.run(main())
