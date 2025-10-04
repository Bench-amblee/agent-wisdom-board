"""
Fake sales data for the Sales Agent to reference
"""

SALES_DATA = {
    "current_quarter": {
        "revenue": 2450000,
        "target": 3000000,
        "deals_closed": 47,
        "pipeline_value": 5200000,
        "avg_deal_size": 52127,
        "conversion_rate": 23.5
    },
    "top_products": [
        {
            "name": "Enterprise Platform",
            "revenue": 1200000,
            "units_sold": 15,
            "growth": "+35%"
        },
        {
            "name": "Professional Suite",
            "revenue": 800000,
            "units_sold": 25,
            "growth": "+18%"
        },
        {
            "name": "Starter Package",
            "revenue": 450000,
            "units_sold": 45,
            "growth": "+12%"
        }
    ],
    "top_customers": [
        {
            "name": "TechCorp Industries",
            "lifetime_value": 450000,
            "current_plan": "Enterprise",
            "satisfaction_score": 9.2
        },
        {
            "name": "Global Solutions Inc",
            "lifetime_value": 380000,
            "current_plan": "Enterprise",
            "satisfaction_score": 8.8
        },
        {
            "name": "Innovation Labs",
            "lifetime_value": 220000,
            "current_plan": "Professional",
            "satisfaction_score": 9.5
        }
    ],
    "pipeline": [
        {
            "prospect": "Fortune 500 Retail",
            "stage": "Negotiation",
            "value": 650000,
            "probability": 75,
            "close_date": "2025-11-15"
        },
        {
            "prospect": "Mid-Market Manufacturing",
            "stage": "Proposal",
            "value": 280000,
            "probability": 50,
            "close_date": "2025-11-30"
        },
        {
            "prospect": "Healthcare System",
            "stage": "Discovery",
            "value": 420000,
            "probability": 25,
            "close_date": "2025-12-15"
        }
    ],
    "regional_performance": {
        "North America": {"revenue": 1400000, "growth": "+22%"},
        "Europe": {"revenue": 650000, "growth": "+15%"},
        "Asia Pacific": {"revenue": 400000, "growth": "+45%"}
    }
}

def get_sales_context() -> str:
    """Returns formatted sales data for agent context"""
    return f"""
Current Quarter Performance:
- Revenue: ${SALES_DATA['current_quarter']['revenue']:,} (Target: ${SALES_DATA['current_quarter']['target']:,})
- Deals Closed: {SALES_DATA['current_quarter']['deals_closed']}
- Pipeline Value: ${SALES_DATA['current_quarter']['pipeline_value']:,}
- Average Deal Size: ${SALES_DATA['current_quarter']['avg_deal_size']:,}
- Conversion Rate: {SALES_DATA['current_quarter']['conversion_rate']}%

Top Products:
{chr(10).join([f"- {p['name']}: ${p['revenue']:,} ({p['units_sold']} units, {p['growth']} growth)" for p in SALES_DATA['top_products']])}

Top Customers:
{chr(10).join([f"- {c['name']}: ${c['lifetime_value']:,} LTV, {c['current_plan']} plan, {c['satisfaction_score']}/10 satisfaction" for c in SALES_DATA['top_customers']])}

Active Pipeline:
{chr(10).join([f"- {p['prospect']}: ${p['value']:,} ({p['stage']}, {p['probability']}% probability)" for p in SALES_DATA['pipeline']])}
"""
