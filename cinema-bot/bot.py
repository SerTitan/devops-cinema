import asyncio
from aiohttp import web
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from config import BOT_TOKEN, EVENT_PORT
from handlers import router, broadcast

bot = Bot(token=BOT_TOKEN, parse_mode=ParseMode.HTML)
dp = Dispatcher()
dp.include_router(router)


async def event_handler(request: web.Request):
    data = await request.json()
    if text := data.get("message"):
        await broadcast(bot, text)
    return web.Response(text="ok")


async def main():
    app = web.Application()
    app.add_routes([web.post("/event", event_handler)])
    runner = web.AppRunner(app)
    await runner.setup()
    await web.TCPSite(runner, port=EVENT_PORT).start()
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
