import { supportFaq, supportContacts } from "../data/siteData.js";

export default function SupportPage() {
  return (
    <section className="min-h-[calc(100svh-64px)] bg-gray-50 pb-28 md:pb-14">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="mb-4 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600"
          >
            ← На главную
          </a>
          <h1 className="text-2xl font-bold text-gray-950 md:text-3xl">Поддержка Twins</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
            Ответы на частые вопросы, контакты и помощь по работе с сервисом в Костанае.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {supportContacts.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm transition hover:border-indigo-100 hover:shadow-md"
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="mt-2 text-sm font-semibold text-gray-950">{item.label}</div>
              <p className="mt-1 text-xs text-gray-500">{item.hint}</p>
            </a>
          ))}
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-950">Частые вопросы</h2>
          <div className="space-y-3">
            {supportFaq.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-gray-100 bg-gray-50/50 open:bg-white open:shadow-sm"
              >
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-900 marker:content-none">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span className="text-indigo-400 transition group-open:rotate-180">▼</span>
                  </span>
                </summary>
                <p className="border-t border-gray-100 px-4 py-3 text-sm leading-relaxed text-gray-500">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-pink-100 bg-pink-50 p-5">
          <h3 className="font-semibold text-gray-950">Не нашли ответ?</h3>
          <p className="mt-2 text-sm text-gray-600">
            Напишите нам в WhatsApp или Telegram — команда Twins ответит в рабочее время.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="https://wa.me/77000000000"
              className="rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/twins_support"
              className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
