import pytest, importlib, sys
from unittest.mock import AsyncMock
from datetime import datetime, timezone
from aiogram import Bot, Dispatcher, types
from aiogram.fsm.storage.memory import MemoryStorage
from handlers import router, broadcast, _subscribers


def _now(): return datetime.now(timezone.utc)


@pytest.mark.asyncio
async def test_full_flow(monkeypatch):
    # ---- покрываем bot.py (без сети) ---------------------------------
    fake_bot = AsyncMock()
    fake_dp  = AsyncMock()
    monkeypatch.setattr("aiogram.Bot", lambda *a, **k: fake_bot)
    monkeypatch.setattr("aiogram.Dispatcher", lambda *a, **k: fake_dp)
    if "bot" in sys.modules: sys.modules.pop("bot")
    bot_mod = importlib.import_module("bot")
    await bot_mod.main()
    fake_dp.start_polling.assert_awaited_once()

    # ---- проверяем подписку и рассылку -------------------------------
    bot = AsyncMock(spec=Bot)
    dp  = Dispatcher(storage=MemoryStorage()); dp.include_router(router)

    msg = types.Message(
        message_id=1,
        chat=types.Chat(id=1, type="private"),
        date=_now(),
        text="/subscribe",
        from_user=types.User(id=1, is_bot=False, first_name="U"),
    )
    msg.answer = AsyncMock()
    object.__setattr__(msg, "_bot", bot)

    await dp.feed_update(bot, types.Update(update_id=0, message=msg))
    assert 1 in _subscribers and msg.answer.called

    await broadcast(bot, "hi")
    bot.send_message.assert_awaited_once_with(1, "hi")
