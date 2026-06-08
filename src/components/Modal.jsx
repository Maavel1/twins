import { useState } from "react";
import AuthGateCard from "./AuthGateCard.jsx";
import { CloseIcon } from "./Icons.jsx";
import { buildMessengerLinks, buildMessengerMessage } from "../data/siteData.js";
import { formatKzPhone, getPhoneValidationError, normalizeKzPhone } from "../utils/phone.js";
import { validateComment, validateName } from "../utils/input.js";
import { sanitizeText, throttleAction } from "../utils/security.js";

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
  onContactClick,
  onOpenContact,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [commentError, setCommentError] = useState("");

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

          {client ? (
            <>
              <div className="mb-4 rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
                {buildMessengerMessage(modal.master)}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onContactClick?.(modal.master)}
                  className="rounded-2xl bg-green-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-600"
                >
                  WhatsApp
                </a>
                <a
                  href={links.telegram}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onContactClick?.(modal.master)}
                  className="rounded-2xl bg-sky-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  Telegram
                </a>
              </div>
            </>
          ) : (
            <AuthGateCard
              title="Контакты доступны после входа"
              description="Зарегистрируйтесь как клиент, чтобы увидеть WhatsApp и Telegram мастера."
              onLogin={onRequireClientAuth}
              compact
            />
          )}
        </div>
      </div>
    );
  }

  if (modal.type === "profile" && modal.master) {
    const masterReviews = reviews.filter((review) => review.masterId === modal.master.id).slice(0, 5);
    const isFavorite = favoriteIds.includes(modal.master.id);

    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-white md:items-center md:justify-center md:bg-gray-950/40 md:p-4 md:backdrop-blur-sm">
        <div className="flex h-full max-h-[100svh] w-full flex-col overflow-hidden md:max-h-[90svh] md:max-w-2xl md:rounded-[28px] md:shadow-2xl">
          <div className={`relative shrink-0 overflow-hidden ${modal.master.pro ? "bg-gradient-to-br from-pink-500 to-indigo-600" : "bg-gradient-to-br from-indigo-500 to-indigo-700"} px-4 pb-6 pt-4 text-white md:rounded-t-[28px]`}>
            <div className="mb-4 flex items-center justify-between">
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur" aria-label="Закрыть">
                ←
              </button>
              <button type="button" onClick={() => onShareMaster(modal.master)} className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                Поделиться
              </button>
            </div>
            <div className="flex items-end gap-4">
              <div className={`grid h-20 w-20 place-items-center rounded-2xl border-4 border-white/30 bg-white text-2xl font-bold ${modal.master.color}`}>
                {modal.master.initials}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold">{modal.master.name}</h2>
                  {modal.master.pro && <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">PRO</span>}
                </div>
                <p className="mt-1 text-sm text-white/80">{modal.master.service}</p>
                <p className="text-xs text-white/60">{modal.master.category} · {modal.master.price}</p>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-28 md:pb-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Рейтинг", value: modal.master.rating },
                { label: "Расстояние", value: modal.master.distance },
                { label: "График", value: modal.master.schedule },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-gray-50 p-3 text-center">
                  <div className="text-sm font-bold text-gray-950">{item.value}</div>
                  <div className="mt-0.5 text-[10px] text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gray-950">О мастере</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {modal.master.service}. Проверенный специалист Twins в Костanae. Запишитесь онлайн или свяжитесь напрямую.
              </p>
              {modal.master.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {modal.master.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {client ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => onOpenContact?.(modal.master)} className="rounded-2xl bg-pink-500 py-3.5 text-sm font-semibold text-white">
                  Связаться
                </button>
                <button type="button" onClick={() => onFavoriteToggle(modal.master)} className={`${isFavorite ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-600"} rounded-2xl py-3.5 text-sm font-semibold`}>
                  {isFavorite ? "♥ В избранном" : "♡ В избранное"}
                </button>
                <button type="button" onClick={() => onSubmitLead({ type: "profile-booking", master: modal.master.name, category: modal.master.category })} className="col-span-2 rounded-2xl bg-gray-950 py-3.5 text-sm font-semibold text-white">
                  Оставить заявку
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <AuthGateCard
                  title="Войдите, чтобы связаться"
                  description="Избранное, заявки и контакты мастера доступны только зарегистрированным клиентам."
                  onLogin={onRequireClientAuth}
                  compact
                />
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-gray-100 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-950">Отзывы</h3>
                {!client && <button type="button" onClick={onRequireClientAuth} className="text-xs font-semibold text-indigo-600">Войти для отзыва</button>}
              </div>

              {client && (
                <form className="mb-4 rounded-2xl bg-gray-50 p-3" onSubmit={(event) => {
                  event.preventDefault();
                  const throttle = throttleAction("review:submit", 2000);
                  if (!throttle.allowed) return;
                  const { value: safeComment, error } = validateComment(comment);
                  if (error) { setCommentError(error); return; }
                  setCommentError("");
                  const ok = onSubmitReview({ master: modal.master, rating, comment: safeComment });
                  if (ok) setComment("");
                }}>
                  <div className="mb-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className={`${star <= rating ? "text-pink-500" : "text-gray-300"} text-xl`}>★</button>
                    ))}
                  </div>
                  <textarea value={comment} onChange={(event) => { setComment(event.target.value); setCommentError(""); }} maxLength={500} className={`min-h-20 w-full rounded-2xl border bg-white px-3 py-2 text-sm outline-none ${commentError ? "border-red-300" : "border-gray-200"}`} placeholder="Комментарий" />
                  {commentError && <p className="mt-1 text-xs text-red-500">{commentError}</p>}
                  <button className="mt-2 rounded-xl bg-pink-500 px-4 py-2.5 text-xs font-semibold text-white">Опубликовать</button>
                </form>
              )}

              <div className="space-y-2">
                {masterReviews.length ? masterReviews.map((review) => (
                  <div key={review.id} className="rounded-2xl bg-gray-50 p-3 text-sm">
                    <div className="font-semibold text-gray-800">{review.clientName} · {review.rating} ★</div>
                    <div className="mt-1 text-gray-500">{review.comment || "Без комментария"}</div>
                  </div>
                )) : <div className="text-sm text-gray-500">Пока нет отзывов.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const needsClientAuth = modal.type === "booking" || modal.type === "register";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/40 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">{titleByType[modal.type]}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              {modal.master ? `Мастер: ${modal.master.name}. ` : ""}
              {modal.type === "pro"
                ? "Заявка на PRO для мастеров."
                : "Запись и заявки доступны зарегистрированным клиентам."}
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

        {needsClientAuth && !client ? (
          <AuthGateCard
            title="Сначала войдите как клиент"
            description="После регистрации вы сможете записаться к мастеру и отслеживать заявку в личном кабинете."
            onLogin={onRequireClientAuth}
            compact
          />
        ) : (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const throttle = throttleAction("modal:submit", 2000);
            if (!throttle.allowed) return;
            const formData = new FormData(event.currentTarget);
            const useClientProfile = client && modal.type === "booking";
            let safeName = "";
            if (!useClientProfile) {
              const rawPhone = formData.get("phone") ?? "";
              const phoneValidationError = getPhoneValidationError(rawPhone);
              if (phoneValidationError) {
                setPhoneError(phoneValidationError);
                return;
              }
              if (modal.type !== "login") {
                const nameResult = validateName(formData.get("name") ?? "");
                if (nameResult.error) {
                  setNameError(nameResult.error);
                  return;
                }
                safeName = nameResult.value;
              }
            }
            setPhoneError("");
            setNameError("");
            onSubmitLead({
              type: modal.type,
              master: modal.master?.name ?? "",
              category: modal.master?.category ?? "",
              name: useClientProfile ? client.name : safeName,
              phone: useClientProfile ? client.phone : normalizeKzPhone(formData.get("phone") ?? ""),
              time: sanitizeText(formData.get("time") ?? "", { maxLength: 80 }),
            });
          }}
        >
          {client && modal.type === "booking" ? (
            <div className="rounded-xl bg-indigo-50 px-3 py-2.5 text-sm text-indigo-800">
              Заявка от <span className="font-semibold">{client.name}</span>
            </div>
          ) : (
            <>
              {modal.type !== "login" && (
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-gray-500">Имя</span>
                  <input
                    name="name"
                    maxLength={60}
                    onInput={() => setNameError("")}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${nameError ? "border-red-300" : "border-gray-200 focus:border-indigo-400"}`}
                    placeholder="Ваше имя"
                  />
                  {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
                </label>
              )}
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">Телефон</span>
                <input
                  name="phone"
                  onInput={(event) => {
                    event.currentTarget.value = formatKzPhone(event.currentTarget.value);
                    setPhoneError("");
                  }}
                  inputMode="tel"
                  autoComplete="tel"
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${phoneError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-indigo-400"}`}
                  placeholder="+7 (777) 000-00-00"
                />
                {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
              </label>
            </>
          )}
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
        )}
      </div>
    </div>
  );
}
