import { maskPhone } from "../../utils/phone.js";

const typeLabels = {
  booking: "Запись",
  "profile-booking": "Заявка с профиля",
  pro: "Twins PRO",
  register: "Регистрация",
  login: "Вход",
};

export default function MasterLeadsPanel({ leads, onOpenChat }) {
  if (!leads.length) {
    return (
      <div className="tw-panel p-8 text-center">
        <div className="text-3xl">📭</div>
        <h3 className="mt-3 font-semibold text-gray-950">Заявок пока нет</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
          Когда клиент оставит заявку или запишется — она появится здесь с уведомлением.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <article key={lead.id} className="tw-panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600">
                  {typeLabels[lead.type] ?? lead.type}
                </span>
                {lead.unread && (
                  <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    Новое
                  </span>
                )}
              </div>
              <h4 className="mt-2 font-semibold text-gray-950">{lead.name || "Клиент"}</h4>
              <p className="text-sm text-gray-500">
                {lead.phone ? maskPhone(lead.phone) : "Телефон не указан"}
                {lead.time ? ` · ${lead.time}` : ""}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(lead.createdAt).toLocaleString("ru-RU")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenChat(lead)}
              className="shrink-0 rounded-xl bg-gray-950 px-3 py-2 text-xs font-semibold text-white"
            >
              Чат
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
