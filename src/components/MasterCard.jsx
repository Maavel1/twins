export default function MasterCard({
  master,
  compact = false,
  isFavorite = false,
  onFavoriteToggle,
  onBooking,
  onProfile,
  onContact,
}) {
  return (
    <article className={`${master.pro ? "pro-card-glow" : "border border-gray-100"} relative flex h-full flex-col rounded-2xl bg-white p-4 card-lift`}>
      {master.pro && <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-semibold text-white">PRO</span>}
      <button
        type="button"
        onClick={() => onFavoriteToggle(master)}
        className={`${isFavorite ? "bg-pink-500 text-white" : "bg-white text-gray-400"} absolute right-3 top-9 grid h-9 w-9 place-items-center rounded-full shadow-sm ring-1 ring-gray-100 transition hover:bg-pink-500 hover:text-white`}
        aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        title={isFavorite ? "В избранном" : "Добавить в избранное"}
      >
        ♥
      </button>
      <div className="flex flex-1 items-start gap-3">
        <div className={`grid h-12 w-12 flex-shrink-0 place-items-center rounded-full ${master.color} text-base font-bold`}>{master.initials}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2 pr-10">
            <button type="button" onClick={() => onProfile(master)} className="min-w-0 text-left">
              <h3 className="truncate text-sm font-semibold text-gray-950 transition hover:text-indigo-600">{master.name}</h3>
            </button>
          </div>
          <p className="text-xs text-gray-500">{master.service}</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-[11px] text-gray-500">
            <span>★ {master.rating}</span>
            <span>📍 {master.distance}</span>
            <span>🕒 {master.schedule}</span>
          </div>
          <div className="mt-4">
            <div className="mb-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">{master.price}</div>
            <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => onProfile(master)} className="min-h-10 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100 transition hover:bg-indigo-50">
              Профиль
            </button>
            <button type="button" onClick={() => onContact(master)} className={`${compact ? "px-3" : "px-4"} min-h-10 rounded-xl bg-pink-500 py-2 text-xs font-semibold text-white transition hover:bg-pink-600`}>
              Связаться
            </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
