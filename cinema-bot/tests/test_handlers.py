import pytest
from aiogram import Bot, Dispatcher, types
from aiogram.fsm.storage.memory import MemoryStorage
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

from handlers import register_handlers, ReviewStates


def _msg(text: str) -> types.Message:
    return types.Message(
        message_id=1,
        date=datetime.now(timezone.utc),
        chat=types.Chat(id=1, type="private"),
        text=text,
        from_user=types.User(id=1, is_bot=False, first_name="U"),
    )


def _wrap(obj, bot):
    object.__setattr__(obj, "_bot", bot)
    return obj


@pytest.fixture
def dispatcher():
    dp = Dispatcher(storage=MemoryStorage())
    register_handlers(dp)
    return dp


@pytest.mark.asyncio
async def test_start(dispatcher):
    bot = AsyncMock(spec=Bot)
    m = _msg("/start"); m.answer = AsyncMock()
    await dispatcher.feed_update(bot, _wrap(m, bot))
    assert m.answer.called


@pytest.mark.asyncio
async def test_movies_nonempty(dispatcher):
    bot = AsyncMock(spec=Bot)
    m = _msg("/movies"); m.answer = AsyncMock()
    with patch("api.get_movies", return_value=[{"id": 1, "title": "X"}]):
        await dispatcher.feed_update(bot, _wrap(m, bot))
    assert m.answer.called


@pytest.mark.asyncio
async def test_movies_empty(dispatcher):
    bot = AsyncMock(spec=Bot)
    m = _msg("/movies"); m.answer = AsyncMock()
    with patch("api.get_movies", return_value=[]):
        await dispatcher.feed_update(bot, _wrap(m, bot))
    assert m.answer.called


@pytest.mark.asyncio
async def test_reviews_and_add(dispatcher):
    bot = AsyncMock(spec=Bot)

    m = _msg("placeholder"); m.answer = AsyncMock()
    cb = types.CallbackQuery(
        id="1", from_user=types.User(id=1, is_bot=False, first_name="U"),
        data="review_42", chat_instance="x", message=m
    )
    with patch("api.get_movie_reviews", return_value=[{"author": "U", "content": "Ok"}]):
        await dispatcher.feed_update(bot, _wrap(cb, bot))
    assert m.answer.called

    review = _msg("Good!"); review.answer = AsyncMock()
    ctx = dispatcher.fsm.get_context(bot=bot, chat_id=1, user_id=1)
    await ctx.set_state(ReviewStates.waiting_for_text)
    await ctx.update_data(movie_id=42)
    with patch("api.add_review", return_value={"status": "ok"}):
        await dispatcher.feed_update(bot, _wrap(review, bot))
    assert review.answer.called
