import pytest
from unittest.mock import AsyncMock
import bot


def test_bot_setup():
    assert bot.bot and bot.dp


@pytest.mark.asyncio
async def test_bot_main(monkeypatch):
    dp_mock = AsyncMock()
    bot_mock = AsyncMock()
    monkeypatch.setattr(bot, "dp", dp_mock)
    monkeypatch.setattr(bot, "bot", bot_mock)

    await bot.main()
    dp_mock.start_polling.assert_awaited_once_with(bot_mock)
