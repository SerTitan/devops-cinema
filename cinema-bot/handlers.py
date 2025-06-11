from typing import List, Dict

from aiogram import types, F, Router
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.context import FSMContext

import api


class ReviewStates(StatesGroup):
    waiting_for_text = State()


async def cmd_start(m: types.Message) -> None:
    await m.answer("Используйте /movies для списка фильмов")


async def cmd_help(m: types.Message) -> None:
    await m.answer("/movies — список фильмов")


async def cmd_movies(m: types.Message) -> None:
    movies: List[Dict] = await api.get_movies()
    if not movies:
        await m.answer("Список пуст")
        return
    kb = InlineKeyboardBuilder()
    for mv in movies:
        kb.button(text=mv.get("title", "<no title>"), callback_data=f"review_{mv['id']}")
    kb.adjust(1)
    await m.answer("Фильмы:", reply_markup=kb.as_markup())


async def cb_show_reviews(c: types.CallbackQuery) -> None:
    mid = int(c.data.split("_")[1])
    reviews = await api.get_movie_reviews(mid)
    text = "\n".join(f"{r['author']}: {r['content']}" for r in reviews) or "Нет отзывов"
    kb = InlineKeyboardBuilder()
    kb.button(text="Добавить отзыв", callback_data=f"add_{mid}")
    await c.message.answer(text, reply_markup=kb.as_markup())
    await c.answer()


async def cb_add_review_start(c: types.CallbackQuery, state: FSMContext) -> None:
    await state.update_data(movie_id=int(c.data.split("_")[1]))
    await state.set_state(ReviewStates.waiting_for_text)
    await c.message.answer("Текст отзыва:")
    await c.answer()


async def fsm_save_review(message: types.Message, state: FSMContext) -> None:
    mid = (await state.get_data())["movie_id"]
    await api.add_review(mid, message.from_user.first_name, message.text)
    await message.answer("Сохранено")
    await state.clear()


def build_router() -> Router:
    r = Router()
    r.message.register(cmd_start,  F.text == "/start")
    r.message.register(cmd_help,   F.text == "/help")
    r.message.register(cmd_movies, F.text == "/movies")
    r.callback_query.register(cb_show_reviews,    F.data.startswith("review_"))
    r.callback_query.register(cb_add_review_start, F.data.startswith("add_"))
    r.message.register(fsm_save_review, ReviewStates.waiting_for_text)
    return r


def register_handlers(dp_or_router):
    dp_or_router.include_router(build_router())
