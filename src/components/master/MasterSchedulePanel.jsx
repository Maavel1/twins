const defaultHours = ["10:00", "12:00", "14:00", "16:00", "18:00"];
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function MasterSchedulePanel({ slots, onToggleSlot }) {
  return (
    <div className="tw-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-950">Расписание</h3>
          <p className="text-xs text-gray-400">Отметьте свободные слоты на неделю</p>
        </div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          {Object.values(slots).filter(Boolean).length} слотов
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-8 gap-1 text-center text-[10px] font-semibold text-gray-400">
            <div />
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          {defaultHours.map((hour) => (
            <div key={hour} className="mt-1 grid grid-cols-8 gap-1">
              <div className="flex items-center text-xs font-medium text-gray-500">{hour}</div>
              {weekDays.map((day) => {
                const key = `${day}-${hour}`;
                const active = slots[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onToggleSlot(key)}
                    className={`h-9 rounded-lg text-[10px] font-semibold transition ${
                      active
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    {active ? "✓" : "—"}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400">
        Frontend-заглушка. После backend клиенты увидят реальные свободные окна для записи.
      </p>
    </div>
  );
}
