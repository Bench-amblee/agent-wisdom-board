"""
Linkup service for web search capabilities
"""
import httpx
from typing import List, Dict, Any
from config import settings

class LinkupService:
    def __init__(self):
        self.base_url = settings.linkup_base_url
        self.api_key = settings.linkup_api_key
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def search(self, query: str, depth: str = "standard", output_type: str = "searchResults") -> Dict[str, Any]:
        """
        Search the web using Linkup API

        Args:
            query: Search query string
            depth: Search depth - "standard" or "deep"
            output_type: Type of output - "searchResults" or "sourcedAnswer"

        Returns:
            Search results from Linkup
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/search",
                    headers=self.headers,
                    json={
                        "q": query,
                        "depth": depth,
                        "outputType": output_type
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"Linkup API error: {e}")
                return {
                    "error": str(e),
                    "results": []
                }

    async def get_sourced_answer(self, query: str) -> str:
        """
        Get a sourced answer from Linkup (combines search + synthesis)

        Args:
            query: Question to answer

        Returns:
            Formatted answer with sources
        """
        result = await self.search(query, output_type="sourcedAnswer")

        if "error" in result:
            return f"Error searching: {result['error']}"

        # Extract answer and sources from Linkup response
        answer = result.get("answer", "No answer found")
        sources = result.get("sources", [])

        formatted_response = f"{answer}\n\nSources:\n"
        for idx, source in enumerate(sources[:5], 1):
            formatted_response += f"{idx}. {source.get('name', 'Untitled')} - {source.get('url', '')}\n"

        return formatted_response

    async def search_results(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Get raw search results from Linkup

        Args:
            query: Search query
            max_results: Maximum number of results to return

        Returns:
            List of search results
        """
        result = await self.search(query, output_type="searchResults")

        if "error" in result:
            return []

        results = result.get("results", [])[:max_results]
        return results

linkup_service = LinkupService()
