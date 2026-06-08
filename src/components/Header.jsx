import { cities, navItems } from "../data/siteData.js";
import { MenuIcon } from "./Icons.jsx";

export default function Header({
  isMenuOpen,
  onMenuToggle,
  client,
  masterRegistered,
  masterLoggedIn,
  onCityUnavailable,
}) {
  const clientActive = Boolean(client) && !masterLoggedIn;
  const showBecomeMaster = !masterLoggedIn && !clientActive;
  const masterEntryLabel = masterLoggedIn
    ? "Кабинет мастера"
    : masterRegistered
      ? "Войти как мастер"
      : "Стать мастером";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 header-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2" aria-label="Twins">
            <img
              className="h-10 w-auto max-w-[132px] object-contain sm:h-11 md:h-12"
              src="/twins__logo.svg"
              alt="Логотип Twins"
            />
          </a>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-500 transition hover:text-indigo-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <select
              value="Костанай"
              onChange={(event) => {
                if (event.target.value !== "Костанай")
                  onCityUnavailable?.(event.target.value);
              }}
              className="hidden rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none md:block"
            >
              {cities.map((city) => (
                <option key={city.name} value={city.name} disabled={!city.available}>
                  {city.name}
                  {city.available ? "" : " — скоро"}
                </option>
              ))}
            </select>

            {masterLoggedIn ? (
              <a
                href="#master-profile"
                className="hidden rounded-xl bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-100 sm:block"
              >
                Кабинет мастера
              </a>
            ) : clientActive ? (
              <a
                href="#client-profile"
                className="hidden rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 sm:block"
              >
                {client.name}
              </a>
            ) : (
              <a
                href="#client-auth"
                className="hidden rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 md:block"
              >
                Войти
              </a>
            )}

            {showBecomeMaster && (
              <a
                href="#master-register"
                className="hidden rounded-xl bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600 sm:block"
              >
                {masterEntryLabel}
              </a>
            )}

            <button
              type="button"
              onClick={onMenuToggle}
              className="grid h-10 w-10 place-items-center rounded-xl text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 lg:hidden"
              aria-expanded={isMenuOpen}
              aria-label="Открыть меню"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`${isMenuOpen ? "block" : "hidden"} fixed inset-x-0 top-16 z-40 max-h-[calc(100svh-64px)] overflow-y-auto border-b border-gray-100 bg-white px-4 py-4 shadow-2xl lg:hidden`}
      >
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={onMenuToggle} className="block py-2 text-sm font-medium text-gray-700">
            {item.label}
          </a>
        ))}

        {masterLoggedIn ? (
          <>
            <a href="#master-profile" onClick={onMenuToggle} className="mb-2 mt-3 block w-full rounded-xl bg-pink-500 px-4 py-2.5 text-center text-sm font-semibold text-white">
              Кабинет мастера
            </a>
            <a href="#master-register" onClick={onMenuToggle} className="block w-full rounded-xl bg-pink-50 px-4 py-2.5 text-center text-sm font-semibold text-pink-700 ring-1 ring-pink-100">
              Редактировать профиль
            </a>
          </>
        ) : clientActive ? (
          <a href="#client-profile" onClick={onMenuToggle} className="mb-2 mt-3 block w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-center text-sm font-semibold text-white">
            Мой профиль
          </a>
        ) : (
          <>
            <a href="#client-auth" onClick={onMenuToggle} className="mb-2 mt-3 block w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-center text-sm font-semibold text-white">
              Войти как клиент
            </a>
            <a href="#master-register" onClick={onMenuToggle} className="block w-full rounded-xl bg-pink-500 px-4 py-2.5 text-center text-sm font-semibold text-white">
              {masterEntryLabel}
            </a>
          </>
        )}
      </div>
    </>
  );
}
