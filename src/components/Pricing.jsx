import { proBenefits } from "../data/siteData.js";
import { CheckIcon } from "./Icons.jsx";

export default function Pricing({ onModalOpen }) {
  const planItems = [
    "Безлимитные онлайн-записи",
    "PRO-метка на карте",
    "WhatsApp-уведомления",
    "Аналитика и статистика",
    "Приоритетная поддержка",
  ];

  return (
    <section id="pricing" className="bg-gray-50 px-4 py-12 pb-28 md:py-16 md:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700">
            Twins PRO для мастеров
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-950 md:text-4xl">Получай больше клиентов каждый день</h2>
          <p className="mb-8 leading-relaxed text-gray-500">
            PRO-метка на карте, пульсирующий аватар и приоритет в поиске помогают клиентам заметить тебя первым.
          </p>
          <ul className="space-y-4">
            {proBenefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-pink-100 text-pink-600">
                  <CheckIcon />
                </span>
                <span className="text-sm text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border-2 border-pink-200 bg-white p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="mb-1 text-sm font-semibold text-pink-600">Twins PRO</div>
              <div className="text-4xl font-bold text-gray-950">
                4 990 <span className="text-2xl font-medium text-gray-500">₸</span>
              </div>
              <div className="mt-1 text-sm text-gray-400">в месяц · без скрытых платежей</div>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-500 text-white">★</div>
          </div>
          <div className="mb-8 space-y-3">
            {planItems.map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-gray-50 py-2 text-sm text-gray-700 last:border-b-0">
                <span className="text-pink-500">✓</span>
                {item}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onModalOpen("pro")} className="mb-3 w-full rounded-2xl bg-pink-500 py-3.5 font-semibold text-white transition hover:bg-pink-600">
            Попробовать 7 дней бесплатно
          </button>
          <p className="text-center text-xs text-gray-400">Без привязки карты · отмена в любой момент</p>
        </div>
      </div>
    </section>
  );
}
