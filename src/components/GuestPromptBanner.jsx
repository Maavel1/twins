export default function GuestPromptBanner({ onLogin }) {
  return (
    <div className="border-b border-indigo-100 bg-indigo-50/80">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-indigo-900">
            Зарегистрируйтесь, чтобы связаться с мастерами
          </p>
          <p className="mt-0.5 text-xs text-indigo-700/80">
            Избранное, заявки, чат, контакты и отзывы — только для клиентов Twins.
          </p>
        </div>
        <button
          type="button"
          onClick={onLogin}
          className="shrink-0 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600"
        >
          Войти за 15 секунд
        </button>
      </div>
    </div>
  );
}
