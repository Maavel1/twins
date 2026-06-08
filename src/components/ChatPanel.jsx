import { useState } from "react";
import { sanitizeText, throttleAction } from "../utils/security.js";

export default function ChatPanel({
  activeThread,
  messages,
  onSendMessage,
  onBack,
  viewerRole = "master",
  emptyHint = "Выберите диалог, чтобы открыть чат.",
  placeholder = "Сообщение...",
}) {
  const [draft, setDraft] = useState("");

  if (!activeThread) {
    return (
      <div className="tw-panel p-8 text-center text-sm text-gray-500">{emptyHint}</div>
    );
  }

  const thread = messages.filter((msg) => msg.leadId === activeThread.id);

  const send = (event) => {
    event.preventDefault();
    const throttle = throttleAction(`chat:${activeThread.id}`, 800);
    if (!throttle.allowed) return;
    const text = sanitizeText(draft, { maxLength: 500, allowNewlines: true });
    if (!text) return;
    onSendMessage(activeThread.id, text);
    setDraft("");
  };

  return (
    <div className="tw-panel flex max-h-[520px] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <button type="button" onClick={onBack} className="text-sm font-semibold text-indigo-600">
          ← Назад
        </button>
        <div className="min-w-0">
          <div className="truncate font-semibold text-gray-950">{activeThread.title}</div>
          {activeThread.subtitle && (
            <div className="truncate text-xs text-gray-400">{activeThread.subtitle}</div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
        {thread.length ? (
          thread.map((msg) => {
            const isMine = msg.from === viewerRole;
            return (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  isMine ? "ml-auto bg-indigo-500 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
                <div className={`mt-1 text-[10px] ${isMine ? "text-indigo-100" : "text-gray-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-500">
            Напишите первое сообщение — оно сохранится локально до подключения backend.
          </div>
        )}
      </div>

      <form onSubmit={send} className="border-t border-gray-100 p-3">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={500}
            placeholder={placeholder}
            className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
          />
          <button type="submit" className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white">
            →
          </button>
        </div>
      </form>
    </div>
  );
}
