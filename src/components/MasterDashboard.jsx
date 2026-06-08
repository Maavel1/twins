import { useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { computeMasterRanks } from "../utils/masterStats.js";
import {
  buildMasterReport,
  downloadCsvReport,
  downloadJsonReport,
} from "../utils/exportStats.js";
import { maskPhone } from "../utils/phone.js";
import { limitListSize } from "../utils/security.js";
import SecurityPanel from "./SecurityPanel.jsx";
import MasterLeadsPanel from "./master/MasterLeadsPanel.jsx";
import MasterSchedulePanel from "./master/MasterSchedulePanel.jsx";
import ChatPanel from "./ChatPanel.jsx";

const tabs = [
  { id: "overview", label: "Обзор" },
  { id: "leads", label: "Заявки" },
  { id: "schedule", label: "Расписание" },
  { id: "messages", label: "Чат" },
];

function StatCard({ label, value, hint, accent }) {
  return (
    <div className={`tw-panel p-4 ${accent ? "border-pink-100 bg-pink-50/40" : ""}`}>
      <div className="text-2xl font-bold text-gray-950">{value}</div>
      <div className="mt-1 text-sm font-semibold text-gray-700">{label}</div>
      {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
    </div>
  );
}

function QuickAction({ href, icon, label, hint, onClick, badge }) {
  const className =
    "tw-panel relative flex items-center gap-3 p-4 text-left transition hover:border-indigo-200 hover:shadow-sm";
  const content = (
    <>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-lg">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        {hint && <div className="text-xs text-gray-400">{hint}</div>}
      </div>
      {badge ? (
        <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white">{badge}</span>
      ) : (
        <span className="text-xs text-indigo-400">→</span>
      )}
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`w-full ${className}`}>
        {content}
      </button>
    );
  }
  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}

export default function MasterDashboard({
  profile,
  stats,
  favoriteCount,
  allMasters,
  leads = [],
  onEditProfile,
  onLogout,
  onShareProfile,
  onPreviewProfile,
  onApplyPro,
  onNotify,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeChatLead, setActiveChatLead] = useState(null);
  const [slots, setSlots] = useLocalStorage("twins:masterSlots", {});
  const [readLeadIds, setReadLeadIds] = useLocalStorage("twins:masterReadLeads", []);
  const [messages, setMessages] = useLocalStorage("twins:masterMessages", []);
  const [proStatus] = useLocalStorage("twins:masterProStatus", null);

  const masterId = profile?.id ?? 99999;
  const masterName = profile?.name || "";

  const masterLeads = useMemo(
    () =>
      leads.filter(
        (lead) =>
          lead.master === masterName ||
          (lead.type === "profile-booking" && lead.master === masterName),
      ),
    [leads, masterName],
  );

  const leadsWithUnread = useMemo(
    () =>
      masterLeads.map((lead) => ({
        ...lead,
        unread: !readLeadIds.includes(lead.id),
      })),
    [masterLeads, readLeadIds],
  );

  const unreadCount = leadsWithUnread.filter((lead) => lead.unread).length;

  const masterInList = useMemo(() => {
    return (
      allMasters.find((item) => item.id === masterId) ?? {
        id: masterId,
        name: profile?.name || "Новый мастер",
        category: profile?.category || "Другие",
        rating: "0",
        pro: false,
        service: profile?.about || "Услуги мастера",
      }
    );
  }, [allMasters, masterId, profile]);

  const ranks = useMemo(
    () => computeMasterRanks(masterId, allMasters),
    [masterId, allMasters],
  );

  const markLeadsRead = () => {
    const ids = masterLeads.map((lead) => lead.id);
    setReadLeadIds((current) => [...new Set([...current, ...ids])]);
  };

  const openLeadsTab = () => {
    setActiveTab("leads");
    markLeadsRead();
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
            from: "master",
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

  const toggleSlot = (key) => {
    setSlots((current) => ({ ...current, [key]: !current[key] }));
  };

  const exportStats = (format) => {
    const report = buildMasterReport({
      profile,
      stats,
      ranks,
      favoriteCount,
      leads: masterLeads,
    });
    const date = new Date().toISOString().slice(0, 10);
    if (format === "json") {
      downloadJsonReport(`twins-master-${date}.json`, report);
    } else {
      downloadCsvReport(`twins-master-${date}.csv`, [
        ["Показатель", "Значение"],
        ["Имя", profile.name],
        ["Категория", profile.category],
        ["Просмотры", stats.profileViews],
        ["Контакты", stats.contactClicks],
        ["Избранное", favoriteCount],
        ["Место в поиске", ranks.searchRank ?? "—"],
        ["Место в категории", ranks.categoryRank ?? "—"],
        ["Заявок", masterLeads.length],
        ["Свободных слотов", Object.values(slots).filter(Boolean).length],
      ]);
    }
    onNotify?.("Отчёт скачан", format === "json" ? "JSON-файл готов." : "CSV-файл готов.");
  };

  if (!profile) {
    return (
      <section className="min-h-[calc(100svh-64px)] bg-gray-50 px-4 py-10 pb-28">
        <div className="mx-auto max-w-md tw-panel p-6 text-center">
          <h1 className="text-xl font-semibold text-gray-950">Профиль не найден</h1>
          <p className="mt-2 text-sm text-gray-500">
            Сначала зарегистрируйтесь и сохраните профиль мастера.
          </p>
          <a href="#master-register" className="mt-5 inline-flex rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white">
            Регистрация мастера
          </a>
        </div>
      </section>
    );
  }

  const initials = (profile.name || "НМ").slice(0, 2).toUpperCase();
  const profileUrl = `https://twins.ru/master/${masterId}`;
  const totalEngagement = stats.profileViews + stats.contactClicks + favoriteCount;
  const isPro = masterInList.pro || proStatus === "pending" || proStatus === "active";

  return (
    <section className="min-h-[calc(100svh-64px)] bg-gray-50 py-6 pb-28 md:py-14 md:pb-14">
      <div className="mx-auto max-w-4xl space-y-5 px-4 sm:px-6 lg:px-8">
        <div className="tw-panel overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-indigo-600 px-5 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="relative grid h-16 w-16 place-items-center rounded-2xl border-2 border-white/30 bg-white/15 text-xl font-bold backdrop-blur">
                  {initials}
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-pink-100">Кабинет мастера</p>
                  <h1 className="mt-0.5 text-2xl font-bold">{profile.name}</h1>
                  <p className="mt-1 text-sm text-white/80">
                    {profile.category}
                    {isPro && " · PRO"}
                  </p>
                </div>
              </div>
              <button type="button" onClick={onLogout} className="shrink-0 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur">
                Выйти
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-white sm:grid-cols-4">
            {[
              { label: "Просмотры", value: stats.profileViews },
              { label: "Контакты", value: stats.contactClicks },
              { label: "Заявки", value: masterLeads.length },
              { label: "Избранное", value: favoriteCount },
            ].map((item) => (
              <div key={item.label} className="px-3 py-3 text-center">
                <div className="text-lg font-bold text-gray-950">{item.value}</div>
                <div className="text-[10px] text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {unreadCount > 0 && activeTab !== "leads" && (
          <button
            type="button"
            onClick={openLeadsTab}
            className="flex w-full items-center justify-between rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold text-pink-800">
              🔔 {unreadCount} новых заявок
            </span>
            <span className="text-xs font-semibold text-pink-600">Открыть →</span>
          </button>
        )}

        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "leads") markLeadsRead();
                if (tab.id !== "messages") setActiveChatLead(null);
              }}
              className={`relative shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.id === "leads" && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickAction onClick={openLeadsTab} icon="📋" label="Заявки клиентов" hint="История и статусы" badge={unreadCount || null} />
              <QuickAction onClick={() => setActiveTab("schedule")} icon="📅" label="Расписание" hint="Свободные слоты на неделю" />
              <QuickAction onClick={onPreviewProfile} icon="👁" label="Предпросмотр" hint="Как видят клиенты" />
              <QuickAction onClick={onShareProfile} icon="↗" label="Поделиться" hint="Ссылка на профиль" />
              <QuickAction href="#top" icon="⌖" label="На карте" hint="Ваша метка" />
              <QuickAction onClick={onEditProfile} icon="✎" label="Редактировать" hint="Профиль и контакты" />
            </div>

            <div className="tw-panel border-pink-100 bg-gradient-to-br from-pink-50 to-indigo-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-950">Twins PRO</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {proStatus === "pending"
                      ? "Заявка на PRO отправлена — ожидайте подтверждения."
                      : masterInList.pro
                        ? "PRO активен: приоритет в поиске и метка на карте."
                        : "Поднимите профиль выше в поиске и получите больше заявок."}
                  </p>
                </div>
                {!masterInList.pro && proStatus !== "pending" && (
                  <button
                    type="button"
                    onClick={onApplyPro}
                    className="shrink-0 rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20"
                  >
                    Подключить PRO
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Место в поиске" value={ranks.searchRank ? `#${ranks.searchRank}` : "—"} hint={`из ${ranks.totalInSearch}`} accent={ranks.searchRank && ranks.searchRank <= 5} />
              <StatCard label="В категории" value={ranks.categoryRank ? `#${ranks.categoryRank}` : "—"} hint={masterInList.category} />
              <StatCard label="Вовлечённость" value={totalEngagement} hint="Просмотры + контакты + ♥" />
            </div>

            <div className="tw-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-950">Экспорт статистики</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={() => exportStats("csv")} className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
                    CSV
                  </button>
                  <button type="button" onClick={() => exportStats("json")} className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                    JSON
                  </button>
                </div>
              </div>
            </div>

            <div className="tw-panel p-5">
              <h3 className="text-sm font-semibold text-gray-950">Данные профиля</h3>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-3">
                  <dt className="text-xs text-gray-400">Телефон</dt>
                  <dd className="mt-0.5 font-medium">{maskPhone(profile.phone)}</dd>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <dt className="text-xs text-gray-400">Адрес</dt>
                  <dd className="mt-0.5 font-medium">{profile.address || "—"}</dd>
                </div>
              </dl>
              <p className="mt-3 truncate text-xs text-gray-400">{profileUrl}</p>
            </div>

            <SecurityPanel role="master" />
          </>
        )}

        {activeTab === "leads" && (
          <MasterLeadsPanel leads={leadsWithUnread} onOpenChat={openChat} />
        )}

        {activeTab === "schedule" && (
          <MasterSchedulePanel slots={slots} onToggleSlot={toggleSlot} />
        )}

        {activeTab === "messages" && (
          <ChatPanel
            activeThread={
              activeChatLead
                ? {
                    id: activeChatLead.id,
                    title: activeChatLead.name || "Клиент",
                    subtitle:
                      activeChatLead.type === "booking" ? "Онлайн-запись" : "Заявка",
                  }
                : null
            }
            messages={messages}
            viewerRole="master"
            placeholder="Сообщение клиенту..."
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
