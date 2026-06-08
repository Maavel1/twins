import { useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { maskPhone } from "../utils/phone.js";
import { limitListSize } from "../utils/security.js";
import ChatPanel from "./ChatPanel.jsx";
import PaginatedMasterList from "./PaginatedMasterList.jsx";
import SecurityPanel from "./SecurityPanel.jsx";
import ClientLeadsPanel from "./client/ClientLeadsPanel.jsx";

const tabs = [
  { id: "overview", label: "Обзор" },
  { id: "leads", label: "Заявки" },
  { id: "messages", label: "Чат" },
];

function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

export default function ClientProfile({
  client,
  masters,
  favoriteIds,
  viewedIds,
  leads = [],
  onOpenMaster,
  onLogout,
  onNotify,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeChatLead, setActiveChatLead] = useState(null);
  const [readLeadIds, setReadLeadIds] = useLocalStorage("twins:clientReadLeads", []);
  const [messages, setMessages] = useLocalStorage("twins:masterMessages", []);

  const favorites = masters.filter((master) => favoriteIds.includes(master.id));
  const viewed = viewedIds
    .map((id) => masters.find((master) => master.id === id))
    .filter(Boolean);

  const clientLeads = useMemo(() => {
    if (!client) return [];
    const clientPhone = normalizeDigits(client.phone);
    return leads.filter((lead) => {
      if (client.id && lead.clientId === client.id) return true;
      const leadPhone = normalizeDigits(lead.clientPhone || lead.phone);
      return clientPhone.length >= 11 && leadPhone === clientPhone;
    });
  }, [client, leads]);

  const leadsWithUnread = useMemo(
    () =>
      clientLeads.map((lead) => ({
        ...lead,
        unread: !readLeadIds.includes(lead.id),
      })),
    [clientLeads, readLeadIds],
  );

  const unreadCount = leadsWithUnread.filter((lead) => lead.unread).length;

  const openLeadsTab = () => {
    setActiveTab("leads");
    setReadLeadIds((current) => [
      ...new Set([...current, ...clientLeads.map((lead) => lead.id)]),
    ]);
  };

  const openChat = (lead) => {
    setActiveChatLead(lead);
    setActiveTab("messages");
    setReadLeadIds((current) =>
      current.includes(lead.id) ? current : [...current, lead.id],
    );
    if (!messages.some((msg) => msg.leadId === lead.id)) {
      setMessages((current) =>
        limitListSize(
          [
            {
              id: Date.now(),
              leadId: lead.id,
              from: "client",
              text: `Здравствуйте! Интересует запись${lead.time ? ` на ${lead.time}` : ""}.`,
              createdAt: Date.now(),
            },
            ...current,
          ],
          200,
        ),
      );
    }
  };

  const sendMessage = (leadId, text) => {
    setMessages((current) =>
      limitListSize(
        [
          {
            id: Date.now(),
            leadId,
            from: "client",
            text,
            createdAt: Date.now(),
          },
          ...current,
        ],
        200,
      ),
    );
    onNotify?.("Сообщение отправлено", "Сохранено локально до подключения backend.");
  };

  if (!client) {
    return (
      <section className="min-h-[calc(100svh-64px)] bg-gray-50 px-4 py-10 pb-28">
        <div className="mx-auto max-w-md tw-panel p-6 text-center">
          <h1 className="text-xl font-semibold text-gray-950">Вы не вошли</h1>
          <p className="mt-2 text-sm text-gray-500">
            Авторизуйтесь, чтобы видеть избранных мастеров и историю просмотров.
          </p>
          <a href="#client-auth" className="mt-5 inline-flex rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white">
            Войти за 15 секунд
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100svh-64px)] bg-gray-50 px-4 py-8 pb-28 md:py-14 md:pb-14">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="tw-panel overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-indigo-100">Профиль клиента</p>
                <h1 className="mt-1 text-2xl font-bold">{client.name}</h1>
                <p className="mt-1 text-sm text-indigo-100">{maskPhone(client.phone)}</p>
              </div>
              <button type="button" onClick={onLogout} className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Выйти
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 bg-white">
            {[
              { label: "Избранные", value: favorites.length },
              { label: "Заявки", value: clientLeads.length },
              { label: "Новые", value: unreadCount },
            ].map((item) => (
              <div key={item.label} className="px-3 py-3 text-center">
                <div className="text-lg font-bold text-gray-950">{item.value}</div>
                <div className="text-[10px] text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === "leads") openLeadsTab();
                else setActiveTab(tab.id);
              }}
              className={`relative min-w-0 flex-1 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              {tab.label}
              {tab.id === "leads" && unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <a href="#catalog" className="tw-panel flex items-center gap-3 p-4 transition hover:border-indigo-100">
                <span className="text-xl">🔍</span>
                <span className="text-sm font-semibold text-gray-800">Каталог мастеров</span>
              </a>
              <a href="#top" className="tw-panel flex items-center gap-3 p-4 transition hover:border-indigo-100">
                <span className="text-xl">⌖</span>
                <span className="text-sm font-semibold text-gray-800">Карта рядом</span>
              </a>
              <button
                type="button"
                onClick={openLeadsTab}
                className="tw-panel flex items-center gap-3 p-4 text-left transition hover:border-indigo-100"
              >
                <span className="text-xl">💬</span>
                <span className="text-sm font-semibold text-gray-800">
                  Мои заявки
                  {unreadCount > 0 ? ` (${unreadCount})` : ""}
                </span>
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <PaginatedMasterList
                title="❤️ Любимые мастера"
                masters={favorites}
                emptyText="Добавляйте мастеров в избранное сердечком на карточке."
                onOpenMaster={onOpenMaster}
                pageSize={8}
              />
              <PaginatedMasterList
                title="История просмотров"
                masters={viewed}
                emptyText="Откройте профиль мастера — он появится в истории."
                onOpenMaster={onOpenMaster}
                pageSize={8}
              />
            </div>

            <SecurityPanel role="client" />
          </>
        )}

        {activeTab === "leads" && (
          <ClientLeadsPanel leads={leadsWithUnread} onOpenChat={openChat} />
        )}

        {activeTab === "messages" && (
          <ChatPanel
            activeThread={
              activeChatLead
                ? {
                    id: activeChatLead.id,
                    title: activeChatLead.master || "Мастер",
                    subtitle:
                      activeChatLead.type === "booking" ? "Онлайн-запись" : "Заявка",
                  }
                : null
            }
            messages={messages}
            viewerRole="client"
            placeholder="Сообщение мастеру..."
            emptyHint="Выберите заявку в разделе «Заявки», чтобы открыть чат."
            onSendMessage={sendMessage}
            onBack={() => {
              setActiveChatLead(null);
              setActiveTab("leads");
            }}
          />
        )}
      </div>
    </section>
  );
}
