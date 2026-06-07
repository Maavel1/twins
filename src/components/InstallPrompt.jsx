export default function InstallPrompt({
  isOpen,
  onInstall,
  onClose,
  isMobileDevice,
}) {
  if (!isOpen || !isMobileDevice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end bg-black/50">
      <div className="w-full animate-in slide-in-from-bottom rounded-t-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div className="h-1 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="mb-6 text-center">
          <img
            src="/twins__logo.svg"
            alt="Twins"
            className="mx-auto mb-4 h-12 w-12"
          />
          <h2 className="text-2xl font-bold text-gray-900">Twins</h2>
          <p className="mt-2 text-sm text-gray-600">
            Установи приложение и найди мастера еще быстрее
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-xs font-bold text-indigo-600">✓</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Быстрый доступ</p>
              <p className="text-sm text-gray-600">
                Икона на главном экране — одно нажатие
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-xs font-bold text-indigo-600">✓</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Работает офлайн</p>
              <p className="text-sm text-gray-600">
                Сохраненные данные доступны без интернета
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-xs font-bold text-indigo-600">✓</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Как нативное приложение
              </p>
              <p className="text-sm text-gray-600">
                Полноэкранный режим без адресной строки
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-xs font-bold text-indigo-600">✓</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Уведомления</p>
              <p className="text-sm text-gray-600">
                Будь в курсе новых мастеров и предложений
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Позже
          </button>
          <button
            type="button"
            onClick={onInstall}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Установить
          </button>
        </div>
      </div>
    </div>
  );
}
