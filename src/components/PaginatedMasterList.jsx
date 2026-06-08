import { useMemo, useState } from "react";

function MiniMaster({ master, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(master)}
      className="group flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-gradient-to-r from-white to-gray-50/80 p-3 text-left transition hover:border-indigo-200 hover:from-indigo-50/30 hover:to-white hover:shadow-sm"
    >
      <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl ${master.color} text-sm font-bold shadow-sm`}>
        {master.initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-gray-950">{master.name}</span>
          {master.pro && <span className="rounded-full bg-pink-500 px-1.5 py-0.5 text-[9px] font-bold text-white">PRO</span>}
        </div>
        <div className="truncate text-xs text-gray-500">{master.service}</div>
        <div className="mt-0.5 text-[10px] text-gray-400">★ {master.rating} · {master.distance}</div>
      </div>
      <span className="flex-shrink-0 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100">
        Открыть
      </span>
    </button>
  );
}

export default function PaginatedMasterList({
  title,
  masters,
  emptyText,
  onOpenMaster,
  pageSize = 8,
}) {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return masters;
    return masters.filter((master) =>
      [master.name, master.service, master.category]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [masters, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const slice = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return (
    <div className="tw-panel p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">{title}</h2>
          <p className="text-xs text-gray-400">{filtered.length} в списке</p>
        </div>
        {masters.length > 3 && (
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Поиск..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 sm:max-w-[200px]"
          />
        )}
      </div>

      {filtered.length ? (
        <>
          <div className="grid max-h-[400px] gap-2 overflow-y-auto pr-1">
            {slice.map((master) => (
              <MiniMaster key={master.id} master={master} onOpen={onOpenMaster} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <button type="button" disabled={safePage === 0} onClick={() => setPage((c) => Math.max(0, c - 1))} className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 disabled:opacity-40">
                ← Назад
              </button>
              <span className="text-xs text-gray-400">{safePage + 1} / {totalPages}</span>
              <button type="button" disabled={safePage >= totalPages - 1} onClick={() => setPage((c) => Math.min(totalPages - 1, c + 1))} className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 disabled:opacity-40">
                Далее →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500">{emptyText}</div>
      )}
    </div>
  );
}
