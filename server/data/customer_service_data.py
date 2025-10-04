"""
Fake customer service data for the Customer Service Agent to reference
"""

CUSTOMER_SERVICE_DATA = {
    "metrics": {
        "active_tickets": 124,
        "avg_response_time": "2.3 hours",
        "avg_resolution_time": "18.5 hours",
        "customer_satisfaction": 4.6,
        "first_contact_resolution": 68,
        "ticket_backlog": 23
    },
    "ticket_categories": [
        {"category": "Technical Issues", "count": 45, "avg_resolution": "24 hours", "priority": "High"},
        {"category": "Billing Questions", "count": 32, "avg_resolution": "4 hours", "priority": "Medium"},
        {"category": "Feature Requests", "count": 28, "avg_resolution": "48 hours", "priority": "Low"},
        {"category": "Account Access", "count": 19, "avg_resolution": "2 hours", "priority": "High"}
    ],
    "recent_issues": [
        {
            "id": "TICK-2891",
            "customer": "TechCorp Industries",
            "issue": "API rate limiting errors",
            "status": "In Progress",
            "priority": "High",
            "assigned_to": "Sarah Chen",
            "created": "2025-10-02"
        },
        {
            "id": "TICK-2890",
            "customer": "Innovation Labs",
            "issue": "SSO integration setup",
            "status": "Resolved",
            "priority": "Medium",
            "assigned_to": "Mike Johnson",
            "created": "2025-10-01"
        },
        {
            "id": "TICK-2889",
            "customer": "Global Solutions Inc",
            "issue": "Data export feature not working",
            "status": "In Progress",
            "priority": "High",
            "assigned_to": "Emily Rodriguez",
            "created": "2025-10-01"
        }
    ],
    "common_questions": [
        {
            "question": "How do I reset my password?",
            "frequency": 89,
            "solution": "Use the 'Forgot Password' link on login page or contact support"
        },
        {
            "question": "How do I upgrade my plan?",
            "frequency": 67,
            "solution": "Go to Account Settings > Billing > Change Plan"
        },
        {
            "question": "What are the API rate limits?",
            "frequency": 54,
            "solution": "Starter: 1000/hr, Pro: 5000/hr, Enterprise: Custom limits"
        },
        {
            "question": "How do I add team members?",
            "frequency": 43,
            "solution": "Navigate to Team Settings > Invite Members"
        }
    ],
    "customer_feedback": {
        "positive": [
            "Fast response times",
            "Knowledgeable support staff",
            "Clear documentation"
        ],
        "negative": [
            "Complex onboarding process",
            "Limited self-service options",
            "Occasional long wait times during peak hours"
        ]
    },
    "sla_compliance": {
        "critical": {"target": "1 hour", "actual": "0.8 hours", "compliance": 95},
        "high": {"target": "4 hours", "actual": "3.2 hours", "compliance": 92},
        "medium": {"target": "24 hours", "actual": "18.5 hours", "compliance": 88},
        "low": {"target": "72 hours", "actual": "45 hours", "compliance": 94}
    }
}

def get_customer_service_context() -> str:
    """Returns formatted customer service data for agent context"""
    return f"""
Current Support Metrics:
- Active Tickets: {CUSTOMER_SERVICE_DATA['metrics']['active_tickets']}
- Avg Response Time: {CUSTOMER_SERVICE_DATA['metrics']['avg_response_time']}
- Avg Resolution Time: {CUSTOMER_SERVICE_DATA['metrics']['avg_resolution_time']}
- Customer Satisfaction: {CUSTOMER_SERVICE_DATA['metrics']['customer_satisfaction']}/5.0
- First Contact Resolution: {CUSTOMER_SERVICE_DATA['metrics']['first_contact_resolution']}%

Ticket Categories:
{chr(10).join([f"- {t['category']}: {t['count']} tickets ({t['priority']} priority, avg {t['avg_resolution']})" for t in CUSTOMER_SERVICE_DATA['ticket_categories']])}

Recent Critical Issues:
{chr(10).join([f"- [{i['id']}] {i['customer']}: {i['issue']} ({i['status']}, {i['priority']} priority)" for i in CUSTOMER_SERVICE_DATA['recent_issues'][:3]])}

Most Common Questions:
{chr(10).join([f"- {q['question']} ({q['frequency']} times)" for q in CUSTOMER_SERVICE_DATA['common_questions'][:5]])}

Customer Feedback Summary:
Positive: {', '.join(CUSTOMER_SERVICE_DATA['customer_feedback']['positive'])}
Areas for Improvement: {', '.join(CUSTOMER_SERVICE_DATA['customer_feedback']['negative'])}
"""
