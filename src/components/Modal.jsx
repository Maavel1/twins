import { useState } from "react";
import { CloseIcon } from "./Icons.jsx";
import { buildMessengerLinks, buildMessengerMessage } from "../data/siteData.js";
import { formatKzPhone } from "../utils/phone.js";

export default function Modal({
  modal,
  onClose,
  onSubmitLead,
  client,
  reviews = [],
  onSubmitReview,
  onShareMaster,
  onRequireClientAuth,
  favoriteIds = [],
  onFavoriteToggle,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!modal) return null;

  const titleByType = {
    login: "Вход в Twins",
    register: "Регистрация клиента",
    pro: "Заявка на Twins PRO",
    booking: "Онлайн-запись",
    contact: "Связаться с мастером",
  };

  const submitByType = {
    login: "Войти",
    register: "Создать аккаунт",
    pro: "Отправить заявку",
    booking: "Записаться",
  };

  if (modal.type === "contact" && modal.master) {
    const links = buildMessengerLinks(modal.master);

    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/40 px-4 py-4 backdrop-blur-sm sm:items-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Связаться с мастером</h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {modal.master.name} · {modal.master.service}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Закрыть"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mb-4 rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
            {buildMessengerMessage(modal.master)}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a href={links.whatsapp} target="_blank" rel="noreferrer" className="rounded-2xl bg-green-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-600">
              WhatsApp
            </a>
            <a href={links.telegram} target="_blank" rel="noreferrer" className="rounded-2xl bg-sky-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-600">
              Telegram
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (modal.type === "profile" && modal.master) {
    const masterReviews = reviews.filter((review) => review.masterId === modal.master.id).slice(0, 3);
    const isFavorite = favoriteIds.includes(modal.master.id);

    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/40 px-4 py-4 backdrop-blur-sm sm:items-center">
        <div className="max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`grid h-16 w-16 place-items-center rounded-full ${modal.master.color} text-lg font-bold`}>
                {modal.master.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-950">{modal.master.name}</h2>
                  {modal.master.pro && <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-semibold text-white">PRO</span>}
                </div>
                <p className="mt-1 text-sm text-gray-500">{modal.master.service} · {modal.master.category}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900" aria-label="Закрыть">
              <CloseIcon />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              `Рейтинг ${modal.master.rating}`,
              `Расстояние ${modal.master.distance}`,
              `График ${modal.master.schedule}`,
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-gray-50 p-4 text-sm font-semibold text-gray-700">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-950">О мастере</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Проверенный специалист Twins. В MVP это профиль-заглушка: здесь позже появятся портфолио, отзывы, услуги, расписание и реальные свободные слоты.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={() => onSubmitLead({ type: "profile-booking", master: modal.master.name, category: modal.master.category })} className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
              Оставить заявку
            </button>
            <button type="button" onClick={() => onFavoriteToggle(modal.master)} className={`${isFavorite ? "bg-pink-500 text-white" : "bg-white text-pink-600 ring-1 ring-pink-100"} rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-pink-500 hover:text-white`}>
              {isFavorite ? "В избранном" : "В избранное"}
            </button>
            <button type="button" onClick={() => onShareMaster(modal.master)} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-100 transition hover:bg-indigo-50">
              Поделиться
            </button>
            <button type="button" onClick={() => onClose()} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-50 sm:col-span-3">
              Закрыть
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-950">Отзывы</h3>
              {!client && <button type="button" onClick={onRequireClientAuth} className="text-xs font-semibold text-indigo-600">Войти, чтобы оставить отзыв</button>}
            </div>

            {client && (
              <form
                className="mb-4 rounded-2xl bg-gray-50 p-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const ok = onSubmitReview({ master: modal.master, rating, comment });
                  if (ok) setComment("");
                }}
              >
                <div className="mb-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className={`${star <= rating ? "text-pink-500" : "text-gray-300"} text-xl`}>
                      ★
                    </button>
                  ))}
                </div>
                <textarea value={comment} onChange={(event) => setComment(event.target.value)} className="min-h-20 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="Комментарий о мастере" />
                <button className="mt-2 rounded-xl bg-pink-500 px-4 py-2.5 text-xs font-semibold text-white">Оставить отзыв</button>
              </form>
            )}

            <div className="space-y-2">
              {masterReviews.length ? masterReviews.map((review) => (
                <div key={review.id} className="rounded-2xl bg-gray-50 p-3 text-sm">
                  <div className="font-semibold text-gray-800">{review.clientName} · {review.rating} ★</div>
                  <div className="mt-1 text-gray-500">{review.comment || "Без комментария"}</div>
                </div>
              )) : <div className="text-sm text-gray-500">Пока нет отзывов. Будьте первым.</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/40 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">{titleByType[modal.type]}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              {modal.master ? `Мастер: ${modal.master.name}. ` : ""}
              Это базовая форма-заглушка, которую дальше можно подключить к backend.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            onSubmitLead({
              type: modal.type,
              master: modal.master?.name ?? "",
              category: modal.master?.category ?? "",
              name: formData.get("name") ?? "",
              phone: formData.get("phone") ?? "",
              time: formData.get("time") ?? "",
            });
          }}
        >
          {modal.type !== "login" && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">Имя</span>
              <input name="name" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400" placeholder="Ваше имя" />
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Телефон</span>
            <input
              name="phone"
              onInput={(event) => {
                event.currentTarget.value = formatKzPhone(event.currentTarget.value);
              }}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400"
              placeholder="+7 (777) 000-00-00"
            />
          </label>
          {modal.type === "booking" && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">Удобное время</span>
              <input name="time" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400" placeholder="Сегодня после 18:00" />
            </label>
          )}
          <button type="submit" className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
            {submitByType[modal.type]}
          </button>
        </form>
      </div>
    </div>
  );
}
