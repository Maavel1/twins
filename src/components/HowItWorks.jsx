import { howSteps } from "../data/siteData.js";

export default function HowItWorks() {
  return (
    <section id="how" className="bg-white px-4 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              От поиска до записи
            </div>
            <h2 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
              Как это работает
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-500">
              Twins строится вокруг простого сценария: найти специалиста рядом, быстро сравнить варианты и оставить заявку без лишней суеты.
            </p>

            <div className="mt-8 rounded-3xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-950">Среднее время до заявки</div>
                  <div className="mt-1 text-xs text-gray-500">По базовому сценарию лендинга</div>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                  <div className="text-2xl font-bold text-indigo-600">60 сек</div>
                  <div className="text-[11px] font-medium text-gray-400">без звонка</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-12 hidden h-[calc(100%-96px)] w-px bg-gradient-to-b from-indigo-200 via-pink-200 to-transparent md:block" />
            <div className="space-y-4">
              {howSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="relative rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="flex gap-4">
                    <div className={`${index === 2 ? "bg-pink-500" : "bg-indigo-500"} z-10 grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl text-lg font-bold text-white shadow-lg`}>
                      {step.badge}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 inline-flex rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                        {step.meta}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-950">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
