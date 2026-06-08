import MasterCard from "./MasterCard.jsx";

const sortOptions = [
  { value: "pro", label: "PRO сначала" },
  { value: "rating", label: "По рейтингу" },
  { value: "distance", label: "Ближе" },
  { value: "favorites", label: "Избранные" },
];

export default function MastersSection({
  searchQuery,
  selectedCategory,
  sortMode,
  onSortChange,
  filteredMasters,
  favoriteIds,
  clientLoggedIn = false,
  onFavoriteToggle,
  onBooking,
  onProfile,
  onContact,
}) {
  const hasFilter = searchQuery.trim() || selectedCategory !== "Все";

  return (
    <section id="masters" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-950">Мастера рядом</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
              {hasFilter
                ? `Показываем результаты по запросу ${searchQuery ? `«${searchQuery}»` : `в категории «${selectedCategory}»`}.`
                : "Выбери услугу или категорию, чтобы быстро сузить список специалистов."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortMode}
              onChange={(event) => onSortChange(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="w-fit rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
              {filteredMasters.length} найдено
            </div>
          </div>
        </div>

        {filteredMasters.length ? (
          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <h3 className="text-lg font-semibold text-gray-950">Ничего не найдено</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Попробуй запрос “маникюр”, “массаж”, “сантехник”, “авто” или выбери другую категорию.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
