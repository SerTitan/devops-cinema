import pytest
import importlib
import api


@pytest.mark.asyncio
async def test_stub_functions(monkeypatch):
    async def movies():
        return [{"id": 1, "title": "Test"}]

    async def reviews(mid):
        return [{"author": "A", "content": "B"}]

    async def add(mid, a, t):
        return {"status": "ok"}

    monkeypatch.setattr(api, "get_movies", movies)
    monkeypatch.setattr(api, "get_movie_reviews", reviews)
    monkeypatch.setattr(api, "add_review", add)

    assert (await api.get_movies())[0]["title"] == "Test"
    assert (await api.get_movie_reviews(1))[0]["author"] == "A"
    assert (await api.add_review(1, "X", "Y"))["status"] == "ok"


class _Resp:
    async def __aenter__(self): return self
    async def __aexit__(self, exc_type, exc, tb): pass
    async def json(self): return [{"id": 1, "title": "HTTP"}]
    def raise_for_status(self): pass


class _Sess:
    async def __aenter__(self): return self
    async def __aexit__(self, exc_type, exc, tb): pass
    def get(self, *_): return _Resp()
    def post(self, *_ , **__): return _Resp()


@pytest.mark.asyncio
async def test_http_functions(monkeypatch):
    aiohttp = importlib.import_module("aiohttp")
    monkeypatch.setattr(aiohttp, "ClientSession", _Sess, raising=True)

    from api import _http_get_movies, _http_get_reviews, _http_add_review
    assert await _http_get_movies()
    assert await _http_get_reviews(1)
    assert await _http_add_review(1, "U", "T")
