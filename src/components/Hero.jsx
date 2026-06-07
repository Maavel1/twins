import { categories, stats } from "../data/siteData.js";
import { SearchIcon } from "./Icons.jsx";
import MapView from "./MapView.jsx";

export default function Hero({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  mapQuery,
  geoStatus,
  userLocation,
  filteredMasters,
  onBooking,
  onContact,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    document.querySelector("#masters")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="hidden bg-gray-50 md:block">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:items-center md:py-16 lg:px-8">
        <div className="fade-up-1">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
            Мастера рядом с тобой · Костанай
          </div>
          <h1 className="mb-5 text-4xl font-bold leading-tight text-gray-950 sm:text-5xl">
            Найди лучшего <span className="text-indigo-500">мастера</span> в своем районе
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
            Маникюр, ремонт, массаж и другие услуги на карте. Введи запрос, и карта вместе со списком покажет подходящих мастеров.
          </p>

          <form onSubmit={handleSubmit} className="mb-3 flex max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-1 items-center gap-3 px-4 py-3.5 text-gray-400">
              <SearchIcon />
              <input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                placeholder="Маникюр, сантехник, массаж..."
              />
            </div>
            <button type="submit" className="bg-indigo-500 px-6 text-sm font-semibold text-white transition hover:bg-indigo-600">
              Найти
            </button>
          </form>

          <div className="mb-6 text-xs text-gray-500">
            Найдено: <span className="font-semibold text-gray-900">{filteredMasters.length}</span>
            {mapQuery ? ` · карта ищет «${mapQuery}»` : " · показаны мастера рядом"}
            {geoStatus === "allowed" && " · карта рядом с вами"}
            {geoStatus === "denied" && " · геолокация закрыта, показан центр города"}
          </div>

          <div id="catalog" className="mb-8 flex gap-2 overflow-x-auto pb-1 snap-scroll">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`${selectedCategory === category ? "bg-indigo-500 text-white" : "border border-gray-200 bg-white text-gray-700"} flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition hover:border-indigo-200 hover:text-indigo-600`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid max-w-md grid-cols-3 divide-x divide-gray-200">
            {stats.map((stat) => (
              <div key={stat.label} className="count-up px-4 first:pl-0">
                <div className="text-2xl font-bold text-gray-950">{stat.value}</div>
                <div className="mt-0.5 text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up-2 hidden md:block">
          <MapView
            query={mapQuery}
            geoStatus={geoStatus}
            userLocation={userLocation}
            filteredMasters={filteredMasters}
            onBooking={onBooking}
            onContact={onContact}
          />
        </div>
      </div>
    </section>
  );
}
