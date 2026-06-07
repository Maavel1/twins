import { categories } from "../data/siteData.js";
import { SearchIcon } from "./Icons.jsx";
import MapView from "./MapView.jsx";
import MasterCard from "./MasterCard.jsx";

function GeoBadge({ geoStatus, filteredCount, mapQuery }) {
  const statusText = {
    requesting: "Определяем район...",
    allowed: "Карта рядом с вами",
    denied: "Показан центр города",
    unavailable: "Геолокация недоступна",
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/95 px-3 py-2 shadow-lg">
      <div className="min-w-0">
        <div className="truncate text-xs font-semibold text-gray-950">
          {statusText[geoStatus] ?? statusText.denied}
        </div>
        <div className="truncate text-[11px] text-gray-500">
          {filteredCount} найдено{mapQuery ? ` · ${mapQuery}` : ""}
        </div>
      </div>
      <span
        className={`${geoStatus === "allowed" ? "bg-green-500" : "bg-indigo-500"} h-2.5 w-2.5 flex-shrink-0 rounded-full`}
      />
    </div>
  );
}

export default function MobileMap({
  sheetOpen,
  onSheetToggle,
  onTouchStart,
  onTouchEnd,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  mapQuery,
  geoStatus,
  userLocation,
  filteredMasters,
  favoriteIds,
  onFavoriteToggle,
  onBooking,
  onProfile,
  onContact,
}) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gray-100 md:hidden mobile-map-screen"
    >
      <MapView
        mobile
        query={mapQuery}
        geoStatus={geoStatus}
        userLocation={userLocation}
        filteredMasters={filteredMasters}
        onBooking={onBooking}
        onContact={onContact}
      />

      <div className="absolute left-3 right-3 top-3 z-30">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSheetToggle();
          }}
          className="flex overflow-hidden rounded-[22px] border border-white/70 bg-white/95 shadow-xl"
        >
          <div className="flex flex-1 items-center gap-2 px-4 py-3.5 text-gray-400">
            <SearchIcon />
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full text-sm text-gray-700 outline-none placeholder:text-gray-400"
              placeholder="Найти мастера рядом..."
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-500 px-5 text-sm font-semibold text-white"
          >
            Найти
          </button>
        </form>
      </div>

      <div className="absolute left-3 right-3 top-[74px] z-30">
        <GeoBadge
          geoStatus={geoStatus}
          filteredCount={filteredMasters.length}
          mapQuery={mapQuery}
        />
      </div>

      <div className="absolute left-0 right-0 top-[130px] z-30 px-3">
        <div className="flex gap-2 overflow-x-auto pb-1 snap-scroll">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`${selectedCategory === category ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "border border-white/80 bg-white/95 text-gray-700 shadow-sm"} flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold backdrop-blur`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute right-3 top-[188px] z-30 flex flex-col gap-2">
        <a
          href="#masters"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-white/95 text-sm font-bold text-indigo-600 shadow-lg"
        >
          {filteredMasters.length}
        </a>
        <button
          type="button"
          onClick={onSheetToggle}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-white/95 text-sm font-bold text-gray-700 shadow-lg"
        >
          ↑
        </button>
      </div>

      <div
        className={`bottom-sheet absolute bottom-0 left-0 right-0 z-40 max-h-[82svh] overflow-y-auto rounded-t-[28px] bg-white shadow-2xl ${sheetOpen ? "open" : ""}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={onSheetToggle}
          className="sticky top-0 z-10 flex w-full justify-center bg-white/95 pb-2 pt-3 backdrop-blur"
          aria-label="Открыть список мастеров"
        >
          <span className="h-1 w-10 rounded-full bg-gray-300" />
        </button>
        <div className="sticky top-6 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 pb-3 backdrop-blur">
          <div>
            <div className="text-sm font-semibold text-gray-950">
              Мастера рядом
            </div>
            <div className="text-xs text-gray-400">
              {filteredMasters.length
                ? `${filteredMasters.length} специалистов найдено`
                : "Нет мастеров по запросу"}
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600"
          >
            Фильтры
          </button>
        </div>
        <div className="space-y-3 px-4 pb-24 pt-3">
          {filteredMasters.length ? (
            filteredMasters
              .slice(0, 4)
              .map((master) => (
                <MasterCard
                  key={master.id}
                  master={master}
                  compact
                  isFavorite={favoriteIds.includes(master.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onBooking={onBooking}
                  onProfile={onProfile}
                  onContact={onContact}
                />
              ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-500">
              Попробуй другой запрос или категорию.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
