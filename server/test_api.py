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
    """Test full advisory board discussion (multi-round)"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/api/advisory-board/discuss",
            json={
                "question": "How can we improve customer retention?",
                "include_research": True
            },
            timeout=120.0
        )
        data = response.json()
        print(f"\n✓ Advisory Board Discussion:")
        print(f"  Question: {data['question']}")
        print(f"  Total Rounds: {data.get('total_rounds')}")

        rounds = data.get('rounds', [])
        print(f"  Received {len(rounds)} round objects")
        for r in rounds[:2]:  # preview first two rounds
            msgs = r.get('messages', [])
            print(f"    Round {r.get('round_number')} ({r.get('round_type')}): {len(msgs)} messages")
            if msgs:
                first = msgs[0]
                print(f"      First msg by {first.get('agent')}: {first.get('message','')[:100]}...")

        final_report = data.get('final_report')
        if final_report:
            print("\n  Final Report Summary (truncated):")
            print("    ", final_report.get('summary','')[:200], "...")
            print("    Key Points:", len(final_report.get('key_points', [])))
            print("    Recommendations:", len(final_report.get('recommendations', [])))
        else:
            print("  ⚠️  No final_report returned")

        return response.status_code == 200 and final_report is not None

async def test_analyze_report():
    """Test the /api/analyze-report endpoint with mock final report"""
    mock_report = {
        "summary": "Our retention lags due to onboarding gaps and insufficient proactive outreach. Sales pipeline quality impacts churn via misaligned expectations.",
        "key_points": [
            "Onboarding completion rate below 70%",
            "High churn in SMB segment month 2-3",
            "Need unified customer health scoring",
            "Opportunity in upsell via usage expansion",
            "Research suggests competitors improving time-to-value"
        ],
        "agent_metrics": {
            "Sales Director": "Provided pipeline quality metrics",
            "Customer Success Director": "Shared churn cohort analysis",
            "Research Director": "Benchmarked competitor onboarding times"
        },
        "recommendations": [
            "Implement improved onboarding workflow with milestones",
            "Deploy early warning churn signals dashboard",
            "Refine ICP qualification criteria",
            "Launch structured expansion playbook"
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/api/analyze-report",
            json=mock_report,
            timeout=60.0
        )
        if response.status_code != 200:
            print("✗ Analyze report failed:", response.text)
            return False

        data = response.json()
        print("\n✓ Analysis Output:")
        print("  Consensus:", data.get('consensus','')[:180], "...")
        action_plan = data.get('action_plan', [])
        print(f"  Action Plan Tasks: {len(action_plan)}")
        for t in action_plan:
            print(f"    - {t.get('priority')} | {t.get('title')} :: {t.get('reasoning','')[:80]}...")

        # Basic validation
        has_now = any(t.get('priority') == 'Now' for t in action_plan)
        return has_now and isinstance(action_plan, list)

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
        ("Full Advisory Board Discussion", test_advisory_board),
        ("Analyze Final Report", test_analyze_report)
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
