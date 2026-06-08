import { useMemo, useState } from "react";
import { categories } from "../data/siteData.js";
import { validateSearch } from "../utils/input.js";
import MapView from "./MapView.jsx";
import MasterCard from "./MasterCard.jsx";

const sortOptions = [
  { value: "pro", label: "PRO сначала" },
  { value: "rating", label: "По рейтингу" },
  { value: "distance", label: "Ближе" },
  { value: "favorites", label: "Избранные" },
];

function FiltersPanel({
  searchQuery,
  selectedCategory,
  sortMode,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  resultCount,
  compact = false,
}) {
  return (
    <div className={`${compact ? "" : "sticky top-20"} space-y-4 rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm`}>
      <div>
        <h2 className="text-lg font-semibold text-gray-950">Фильтры</h2>
        <p className="mt-1 text-xs text-gray-400">{resultCount} мастеров найдено</p>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-gray-500">Поиск</span>
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Имя, услуга, категория..."
          maxLength={80}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-gray-500">Сортировка</span>
        <select
          value={sortMode}
          onChange={(event) => onSortChange(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div>
        <span className="mb-2 block text-xs font-medium text-gray-500">Категория</span>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`${selectedCategory === category ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-700 ring-1 ring-gray-200"} rounded-full px-3 py-1.5 text-xs font-semibold transition hover:ring-indigo-200`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MastersCatalog({
  allMasters,
  favoriteIds,
  geoStatus,
  userLocation,
  clientLoggedIn = false,
  onRequireClientAuth,
  onFavoriteToggle,
  onBooking,
  onProfile,
  onContact,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [sortMode, setSortMode] = useState("pro");
  const [mapOpen, setMapOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleSearchChange = (value) => {
    const { value: safe } = validateSearch(value);
    setSearchQuery(safe);
  };

  const handleSortChange = (mode) => {
    if (mode === "favorites" && !clientLoggedIn) {
      onRequireClientAuth?.("смотреть избранное");
      return;
    }
    setSortMode(mode);
  };

  const filteredMasters = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const result = allMasters.filter((master) => {
      const categoryMatches =
        selectedCategory === "Все" || master.category === selectedCategory;
      const searchText = [master.name, master.service, master.category, ...master.tags]
        .join(" ")
        .toLowerCase();
      return categoryMatches && (!normalizedQuery || searchText.includes(normalizedQuery));
    });
    return result.sort((a, b) => {
      if (sortMode === "rating") return Number(b.rating) - Number(a.rating);
      if (sortMode === "distance")
        return Number.parseFloat(a.distance) - Number.parseFloat(b.distance);
      if (sortMode === "favorites")
        return (
          Number(favoriteIds.includes(b.id)) - Number(favoriteIds.includes(a.id))
        );
      return Number(b.pro) - Number(a.pro) || Number(b.rating) - Number(a.rating);
    });
  }, [allMasters, favoriteIds, searchQuery, selectedCategory, sortMode]);

  const mapQuery =
    searchQuery.trim() || (selectedCategory === "Все" ? "" : selectedCategory);

  return (
    <section className="min-h-[calc(100svh-64px)] bg-gray-50 pb-28 md:pb-12">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
          <div>
            <a
              href="#top"
              className="mb-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600"
            >
              ← На главную
            </a>
            <h1 className="text-2xl font-bold text-gray-950 md:text-3xl">Каталог мастеров</h1>
            <p className="mt-1 max-w-xl text-sm text-gray-500">
              Расширенный поиск с фильтрами и картой. Найдите специалиста по категории, рейтингу или расстоянию.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-600"
          >
            <span>⌖</span>
            Смотреть на карте
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-200"
          >
            {mobileFiltersOpen ? "Скрыть фильтры" : "Фильтры"}
          </button>
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600"
          >
            Карта
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
            <FiltersPanel
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              sortMode={sortMode}
              onSearchChange={handleSearchChange}
              onCategoryChange={setSelectedCategory}
              onSortChange={handleSortChange}
              resultCount={filteredMasters.length}
            />
          </div>

          <div>
            {filteredMasters.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMasters.map((master) => (
                  <MasterCard
                    key={master.id}
                    master={master}
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
              <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-950">Ничего не найдено</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  Измените фильтры или попробуйте другой запрос.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {mapOpen && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-gray-100">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-gray-950">Мастера на карте</div>
              <div className="text-xs text-gray-400">{filteredMasters.length} на карте</div>
            </div>
            <button
              type="button"
              onClick={() => setMapOpen(false)}
              className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Закрыть
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <MapView
              mobile
              query={mapQuery}
              geoStatus={geoStatus}
              userLocation={userLocation}
              filteredMasters={filteredMasters}
              onBooking={onBooking}
              onContact={onContact}
            />
          </div>
        </div>
      )}
    </section>
  );
}
