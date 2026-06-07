import { maskPhone } from "../utils/phone.js";

function MiniMaster({ master, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(master)} className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm">
      <div className={`grid h-11 w-11 place-items-center rounded-full ${master.color} text-sm font-bold`}>{master.initials}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-gray-950">{master.name}</div>
        <div className="truncate text-xs text-gray-500">{master.service} · {master.distance}</div>
      </div>
      <span className="text-xs font-semibold text-indigo-600">Открыть</span>
    </button>
  );
}

export default function ClientProfile({ client, masters, favoriteIds, viewedIds, onOpenMaster, onLogout }) {
  const favorites = masters.filter((master) => favoriteIds.includes(master.id));
  const viewed = viewedIds.map((id) => masters.find((master) => master.id === id)).filter(Boolean).slice(0, 5);

  if (!client) {
    return (
      <section className="min-h-[calc(100svh-64px)] bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-md rounded-[28px] bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-950">Вы не вошли</h1>
          <p className="mt-2 text-sm text-gray-500">Авторизуйтесь, чтобы видеть избранных мастеров и историю просмотров.</p>
          <a href="#client-auth" className="mt-5 inline-flex rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white">Войти за 15 секунд</a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100svh-64px)] bg-gray-50 py-8 md:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 rounded-[28px] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-950">{client.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{maskPhone(client.phone)}</p>
            </div>
            <button type="button" onClick={onLogout} className="rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-600">Выйти</button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-950">❤️ Любимые мастера</h2>
            <div className="space-y-3">
              {favorites.length ? favorites.map((master) => <MiniMaster key={master.id} master={master} onOpen={onOpenMaster} />) : (
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">Добавляйте мастеров в избранное сердечком.</div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-950">История просмотров</h2>
            <div className="space-y-3">
              {viewed.length ? viewed.map((master) => <MiniMaster key={master.id} master={master} onOpen={onOpenMaster} />) : (
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">Откройте профиль мастера, и он появится здесь.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
