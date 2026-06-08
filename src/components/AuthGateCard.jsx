export default function AuthGateCard({
  title = "Нужна регистрация",
  description = "Войдите как клиент, чтобы пользоваться этой функцией.",
  onLogin,
  compact = false,
}) {
  return (
    <div
      className={`rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white text-center ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className={compact ? "text-xl" : "text-3xl"}>🔒</div>
      <h3 className={`font-semibold text-gray-950 ${compact ? "mt-2 text-sm" : "mt-3 text-base"}`}>
        {title}
      </h3>
      <p className={`text-gray-500 ${compact ? "mt-1 text-xs" : "mt-2 text-sm"}`}>
        {description}
      </p>
      <ul className={`mx-auto max-w-xs text-left text-gray-500 ${compact ? "mt-2 space-y-1 text-[11px]" : "mt-4 space-y-1.5 text-xs"}`}>
        <li>♥ Сохранять мастеров в избранное</li>
        <li>💬 Оставлять заявки и писать в чат</li>
        <li>📱 Видеть контакты WhatsApp и Telegram</li>
        <li>★ Оставлять отзывы</li>
      </ul>
      <button
        type="button"
        onClick={onLogin}
        className={`rounded-2xl bg-indigo-500 font-semibold text-white transition hover:bg-indigo-600 ${
          compact ? "mt-3 px-4 py-2.5 text-xs" : "mt-5 px-5 py-3 text-sm"
        }`}
      >
        Войти или зарегистрироваться
      </button>
      <p className={`text-gray-400 ${compact ? "mt-2 text-[10px]" : "mt-2 text-xs"}`}>
        Регистрация по номеру телефона · код для MVP: 1111
      </p>
    </div>
  );
}
