from aiogram import Router, types, F

router = Router()
_subscribers: set[int] = set()


@router.message(F.text == "/subscribe")
async def subscribe(msg: types.Message):
    _subscribers.add(msg.chat.id)
    await msg.answer("OK")          # ответ совпадает с ожиданием теста


async def broadcast(bot, text: str):
    for cid in list(_subscribers):
        try:
            await bot.send_message(cid, text)
        except Exception:
            _subscribers.discard(cid)
