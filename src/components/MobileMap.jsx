import { useRef, useState } from "react";
import { categories } from "../data/siteData.js";
import { validateSearch } from "../utils/input.js";
import { SearchIcon } from "./Icons.jsx";
import MapView from "./MapView.jsx";
import MasterCard from "./MasterCard.jsx";

const sortOptions = [
  { value: "pro", label: "PRO сначала" },
  { value: "rating", label: "По рейтингу" },
  { value: "distance", label: "Ближе" },
  { value: "favorites", label: "Избранные" },
];

function GeoBadge({ geoStatus, filteredCount }) {
  const statusText = {
    requesting: "Определяем район...",
    allowed: "Рядом с вами",
    denied: "Центр города",
    unavailable: "Без геолокации",
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-gray-700 shadow-md backdrop-blur">
      <span className={`h-2 w-2 rounded-full ${geoStatus === "allowed" ? "bg-green-500" : "bg-indigo-500"}`} />
      {statusText[geoStatus] ?? statusText.denied} · {filteredCount}
    </div>
  );
}

export default function MobileMap({
  sheetOpen,
  onSheetToggle,
  onSheetOpen,
  onSheetClose,
  searchQuery,
  selectedCategory,
  sortMode,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  mapQuery,
  geoStatus,
  userLocation,
  filteredMasters,
  favoriteIds,
  clientLoggedIn = false,
  onFavoriteToggle,
  onBooking,
  onProfile,
  onContact,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const sheetListRef = useRef(null);
  const touchStartY = useRef(0);
  const touchStartScrollTop = useRef(0);

  const handleHandleTouchStart = (event) => {
    touchStartY.current = event.touches[0].clientY;
    touchStartScrollTop.current = sheetListRef.current?.scrollTop ?? 0;
  };

  const handleHandleTouchEnd = (event) => {
    const delta = event.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) onSheetOpen?.();
    else if (sheetOpen && touchStartScrollTop.current <= 0) onSheetClose?.();
  };

  const toggleFilters = () => {
    if (!sheetOpen) onSheetOpen?.();
    setFiltersOpen((open) => !open);
  };

  const handleSearchInput = (value) => {
    const { value: safe, error } = validateSearch(value);
    setSearchError(error);
    onSearchChange(safe);
  };

  return (
    <section id="top" className="relative bg-gray-100 md:hidden">
      <div className="mobile-map-screen relative overflow-hidden">
        <MapView
          mobile
          query={mapQuery}
          geoStatus={geoStatus}
          userLocation={userLocation}
          filteredMasters={filteredMasters}
          onBooking={onBooking}
          onContact={onContact}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-black/20 to-transparent" />

        <div className="pointer-events-none absolute left-3 right-3 top-3 z-30 space-y-2">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSheetOpen?.();
            }}
            className="pointer-events-auto flex overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-xl backdrop-blur"
          >
            <div className="flex flex-1 items-center gap-2 px-3 py-2.5 text-gray-400">
              <SearchIcon />
              <input
                value={searchQuery}
                onChange={(event) => handleSearchInput(event.target.value)}
                maxLength={80}
                className="w-full text-sm text-gray-700 outline-none placeholder:text-gray-400"
                placeholder="Найти мастера..."
              />
            </div>
            <button type="submit" className="bg-indigo-500 px-4 text-sm font-semibold text-white">
              Найти
            </button>
          </form>
          {searchError && (
            <p className="pointer-events-auto rounded-lg bg-red-50 px-2 py-1 text-[10px] text-red-500">{searchError}</p>
          )}
          <div className="pointer-events-auto">
            <GeoBadge geoStatus={geoStatus} filteredCount={filteredMasters.length} />
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-[108px] z-30 px-3">
          <div className="pointer-events-auto flex gap-1.5 overflow-x-auto pb-1 snap-scroll">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`${selectedCategory === category ? "bg-indigo-500 text-white" : "border border-white/80 bg-white/95 text-gray-700"} flex-shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <a
          href="#how"
          className="scroll-down-btn pointer-events-auto absolute z-30 flex items-center gap-1.5 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 text-[11px] font-semibold text-gray-700 shadow-lg backdrop-blur"
          aria-label="Прокрутить страницу вниз"
        >
          <span className="text-indigo-500">↓</span>
          Дальше
        </a>
      </div>

      <div
        className={`bottom-sheet relative z-40 flex max-h-[75svh] flex-col rounded-t-[24px] bg-white shadow-[0_-12px_48px_rgba(15,23,42,0.15)] ${sheetOpen ? "open" : ""}`}
      >
        <button
          type="button"
          onClick={onSheetToggle}
          onTouchStart={handleHandleTouchStart}
          onTouchEnd={handleHandleTouchEnd}
          className="sheet-handle flex w-full shrink-0 flex-col items-center border-b border-gray-100 bg-white pt-2.5"
          aria-label="Открыть список мастеров"
        >
          <span className="h-1 w-12 rounded-full bg-gray-300" />
          <span className="mt-1.5 text-[10px] font-medium text-gray-400">
            {sheetOpen ? "Свайп вниз — свернуть" : "Свайп вверх — открыть список"}
          </span>
        </button>

        <div id="masters" className="sheet-peek shrink-0 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-950">Мастера рядом</div>
              <div className="text-xs text-gray-400">
                {filteredMasters.length ? `${filteredMasters.length} специалистов` : "Нет результатов"}
              </div>
            </div>
            <button
              type="button"
              onClick={toggleFilters}
              className={`${filtersOpen ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-600"} rounded-xl px-3.5 py-2 text-xs font-semibold`}
            >
              Фильтры
            </button>
          </div>

          {filtersOpen && sheetOpen && (
            <div className="mt-3 space-y-3 rounded-2xl bg-gray-50 p-3">
              <select
                value={sortMode}
                onChange={(event) => onSortChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onCategoryChange(category)}
                    className={`${selectedCategory === category ? "bg-indigo-500 text-white" : "bg-white text-gray-700 ring-1 ring-gray-200"} rounded-full px-3 py-1.5 text-xs font-semibold`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div ref={sheetListRef} className="sheet-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-28 pt-2">
          {filteredMasters.length ? (
            <div className="space-y-3">
              {filteredMasters.map((master) => (
                <MasterCard
                  key={master.id}
                  master={master}
                  compact
                  isFavorite={favoriteIds.includes(master.id)}
                  clientLoggedIn={clientLoggedIn}
                  onFavoriteToggle={onFavoriteToggle}
                  onBooking={onBooking}
                  onProfile={onProfile}
                  onContact={onContact}
                />
              ))}
            </div>
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
