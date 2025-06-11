from typing import List, Dict, Any
import os

API_BASE = os.getenv("API_BASE", "http://localhost:8080")
_STUB = os.getenv("API_STUB", "1") == "1"

async def _http_get_movies() -> List[Dict[str, Any]]:
    import aiohttp
    async with aiohttp.ClientSession() as s:
        async with s.get(f"{API_BASE}/movies") as r:
            r.raise_for_status()
            return await r.json()

async def _http_get_reviews(mid: int) -> List[Dict[str, Any]]:
    import aiohttp
    async with aiohttp.ClientSession() as s:
        async with s.get(f"{API_BASE}/movies/{mid}/reviews") as r:
            r.raise_for_status()
            return await r.json()

async def _http_add_review(mid: int, author: str, text: str) -> Dict[str, Any]:
    import aiohttp
    async with aiohttp.ClientSession() as s:
        async with s.post(
            f"{API_BASE}/movies/{mid}/reviews",
            json={"author": author, "content": text},
        ) as r:
            r.raise_for_status()
            return await r.json()

async def _stub_get_movies():
    return [{"id": 1, "title": "Test Movie"}]

async def _stub_get_reviews(mid: int):
    return [{"author": "Tester", "content": "Great!"}]

async def _stub_add_review(mid: int, a: str, t: str):
    return {"status": "ok"}

get_movies = _stub_get_movies if _STUB else _http_get_movies
get_movie_reviews = _stub_get_reviews if _STUB else _http_get_reviews
add_review = _stub_add_review if _STUB else _http_add_review

__all__ = ["get_movies", "get_movie_reviews", "add_review"]
