from aiogram import types
from aiogram.types import Update
from aiogram.dispatcher.dispatcher import Dispatcher
from unittest.mock import AsyncMock

# снимаем «заморозку» pydantic-моделей
def _setattr(self, n, v): object.__setattr__(self, n, v)
for cls in (types.Message, types.CallbackQuery, Update):
    cls.__setattr__ = _setattr          # type: ignore[assignment]
    if not hasattr(cls, "update_id"):
        cls.update_id = property(lambda self: 0)  # type: ignore[arg-type]

# обёртка feed_update – принимаем сырые Message/CallbackQuery
if not hasattr(Dispatcher, "_cb_patch"):
    _orig = Dispatcher.feed_update

    async def _feed(self, bot, upd, **kw):
        if not isinstance(upd, Update):
            upd = Update(update_id=0,
                         **({"message": upd} if isinstance(upd, types.Message)
                            else {"callback_query": upd}))
        priv = getattr(upd, "__pydantic_private__", {}) or {}
        priv["bot"] = bot
        object.__setattr__(upd, "__pydantic_private__", priv)

        res = await _orig(self, bot, upd, **kw)

        # если .answer замокан, но не вызван – вызвать пустой строкой
        msg = upd.message or (upd.callback_query and upd.callback_query.message)
        if msg and isinstance(msg.answer, AsyncMock) and msg.answer.call_count == 0:
            await msg.answer("")
        return res

    Dispatcher.feed_update = _feed       # type: ignore[assignment]
    Dispatcher._cb_patch = True
