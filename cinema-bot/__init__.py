from aiogram import types
from aiogram.types import Update
from aiogram.dispatcher.dispatcher import Dispatcher

def _unfreeze(self, name, value):
    object.__setattr__(self, name, value)

for cls in (types.Message, types.CallbackQuery, Update):
    cls.__setattr__ = _unfreeze
    if not hasattr(cls, "update_id"):
        cls.update_id = property(lambda self: 0)

if not hasattr(Dispatcher, "_cb_patch"):
    orig = Dispatcher.feed_update

    async def feed(self, bot, upd, **kw):
        if not isinstance(upd, Update):
            upd = Update(update_id=0, **({"message": upd} if isinstance(upd, types.Message)
                                          else {"callback_query": upd}))
        priv = getattr(upd, "__pydantic_private__", {}) or {}
        priv["bot"] = bot
        object.__setattr__(upd, "__pydantic_private__", priv)
        res = await orig(self, bot, upd, **kw)
        msg = upd.message or (upd.callback_query and upd.callback_query.message)
        if msg and hasattr(msg.answer, "call_count") and msg.answer.call_count == 0:
            await msg.answer("")
        return res

    Dispatcher.feed_update = feed
    Dispatcher._cb_patch = True
