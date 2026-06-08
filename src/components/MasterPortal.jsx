import { useMemo, useState, useEffect, useRef } from "react";
import {
  categories,
  kostanayAddressSuggestions,
  mapCenter,
} from "../data/siteData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { formatKzPhone } from "../utils/phone.js";

const emptyProfile = {
  phone: "",
  name: "",
  about: "",
  category: "Красота",
  address: mapCenter.address,
  latitude: mapCenter.lat,
  longitude: mapCenter.lng,
  whatsapp: "",
  telegram: "",
};

const YANDEX_MAPS_API_KEY = "057b2b84-a204-4c54-98a4-1dbb53abc333";
let yandexMapsLoader = null;

function loadYandexMaps() {
  if (typeof window === "undefined") return Promise.reject();
  if (window.ymaps) return Promise.resolve(window.ymaps);
  if (yandexMapsLoader) return yandexMapsLoader;

  yandexMapsLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-twins-ymaps="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.ymaps));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
    script.async = true;
    script.dataset.twinsYmaps = "true";
    script.onload = () => resolve(window.ymaps);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return yandexMapsLoader;
}

const steps = [
  { title: "Контакты", hint: "Кто вы и как с вами связаться" },
  { title: "Услуга", hint: "Категория, адрес и точка на карте" },
  { title: "Предпросмотр", hint: "Проверьте профиль перед публикацией" },
];

function ProfilePreview({ profile, isSaved = false }) {
  const initials = (profile.name || "НМ").slice(0, 2).toUpperCase();

  return (
    <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-4">
        <div
          className={`${isSaved ? "pro-pulse border-pink-500" : "border-white"} grid h-16 w-16 place-items-center rounded-full border-[3px] bg-indigo-100 text-lg font-bold text-indigo-700`}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-950">
              {profile.name || "Новый мастер"}
            </h3>
            {isSaved && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                Сохранен
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">{profile.category}</p>
          <p className="mt-2 text-xs text-gray-400">{profile.address}</p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 p-3 text-sm">
          <div className="font-semibold text-gray-950">4.9</div>
          <div className="text-xs text-gray-400">рейтинг</div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3 text-sm">
          <div className="font-semibold text-gray-950">0 заявок</div>
          <div className="text-xs text-gray-400">после публикации</div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3 text-sm">
          <div className="font-semibold text-gray-950">Базовый</div>
          <div className="text-xs text-gray-400">статус</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          О себе
        </div>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {profile.about ||
            "Здесь будет краткое описание мастера, опыта, условий работы и преимуществ."}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="rounded-full bg-gray-50 px-3 py-1.5">
          WhatsApp: {profile.whatsapp || "не указан"}
        </span>
        <span className="rounded-full bg-gray-50 px-3 py-1.5">
          Telegram: {profile.telegram || "не указан"}
        </span>
        <span className="rounded-full bg-gray-50 px-3 py-1.5">
          {profile.latitude}, {profile.longitude}
        </span>
      </div>
    </div>
  );
}

export default function MasterPortal({ onNotify }) {
  const [savedProfile, setSavedProfile] = useLocalStorage(
    "twins:masterProfile",
    null,
  );
  const [verifiedPhone, setVerifiedPhone] = useLocalStorage(
    "twins:masterVerifiedPhone",
    savedProfile?.phone ?? "",
  );
  const [profile, setProfile] = useState(savedProfile ?? emptyProfile);
  const [step, setStep] = useState(savedProfile ? 2 : 0);
  const [isSaved, setIsSaved] = useState(Boolean(savedProfile));
  const [authStep, setAuthStep] = useState(
    verifiedPhone ? "verified" : "phone",
  );
  const [phoneDraft, setPhoneDraft] = useState(savedProfile?.phone ?? "");
  const [codeDraft, setCodeDraft] = useState("");

  const progress = useMemo(
    () => Math.round(((step + 1) / steps.length) * 100),
    [step],
  );
  const addressMatches = useMemo(() => {
    const query = profile.address.trim().toLowerCase();
    if (!query) return kostanayAddressSuggestions;
    return kostanayAddressSuggestions
      .filter((item) => item.address.toLowerCase().includes(query))
      .slice(0, 4);
  }, [profile.address]);

  const updateProfile = (field, value) => {
    setIsSaved(false);
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const chooseAddress = (suggestion) => {
    setIsSaved(false);
    setProfile((current) => ({
      ...current,
      address: suggestion.address,
      latitude: suggestion.lat,
      longitude: suggestion.lng,
    }));
    onNotify?.("Адрес выбран", "Координаты подставлены из frontend-подсказки.");
  };

  const setMarkerByClick = (event) => {
    if (miniMapInstance.current?.map) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const lat = (Number(mapCenter.lat) + (0.5 - y) * 0.04).toFixed(6);
    const lng = (Number(mapCenter.lng) + (x - 0.5) * 0.06).toFixed(6);
    setIsSaved(false);
    setProfile((current) => ({ ...current, latitude: lat, longitude: lng }));
    onNotify?.("Метка поставлена", `${lat}, ${lng}`);
  };

  const addressRef = useRef(null);
  const miniMapRef = useRef(null);
  const miniMapInstance = useRef(null);

  useEffect(() => {
    let suggestView = null;
    let map = null;
    let placemark = null;
    let cancelled = false;

    loadYandexMaps()
      .then((ymaps) => {
        if (cancelled) return;
        ymaps.ready(() => {
          if (cancelled) return;
        try {
          if (addressRef.current) {
            suggestView = new ymaps.SuggestView(addressRef.current, {
              results: 6,
              provider: {
                suggest: (request, options) =>
                  ymaps.suggest(`Костанай, ${request}`, options),
              },
            });
            suggestView.events.add("select", function (e) {
              const text = e.get("item").value;
              ymaps.geocode(text, { results: 1 }).then((res) => {
                const first = res.geoObjects.get(0);
                if (!first) return;
                const coords = first.geometry.getCoordinates();
                const lat = coords[0].toFixed(6);
                const lng = coords[1].toFixed(6);
                setProfile((current) => ({
                  ...current,
                  address: text,
                  latitude: lat,
                  longitude: lng,
                }));
                onNotify?.("Адрес выбран (из Yandex)", `${lat}, ${lng}`);
              });
            });
          }

          if (miniMapRef.current) {
            const center = [
              Number(profile.latitude) || Number(mapCenter.lat),
              Number(profile.longitude) || Number(mapCenter.lng),
            ];
            map = new ymaps.Map(miniMapRef.current, {
              center,
              zoom: 16,
              controls: ["zoomControl"],
            });
            placemark = new ymaps.Placemark(
              center,
              {},
              { draggable: true },
            );
            map.geoObjects.add(placemark);

            placemark.events.add("dragend", function (e) {
              const coords = e.get("target").geometry.getCoordinates();
              const lat = coords[0].toFixed(6);
              const lng = coords[1].toFixed(6);
              setProfile((current) => ({
                ...current,
                latitude: lat,
                longitude: lng,
              }));
              onNotify?.("Метка перемещена", `${lat}, ${lng}`);
            });

            map.events.add("click", function (e) {
              const coords = e.get("coords");
              const lat = coords[0].toFixed(6);
              const lng = coords[1].toFixed(6);
              placemark.geometry.setCoordinates(coords);
              setProfile((current) => ({
                ...current,
                latitude: lat,
                longitude: lng,
              }));
              onNotify?.("Метка поставлена", `${lat}, ${lng}`);
            });
          }
        } catch (err) {
          // ignore map init errors
        }
          miniMapInstance.current = { map, placemark, suggestView };
        });
      })
      .catch(() => {
        onNotify?.("Карта временно недоступна", "Можно поставить точку кликом по схеме ниже.");
      });

    return () => {
      cancelled = true;
      try {
        if (miniMapInstance.current?.map) miniMapInstance.current.map.destroy();
        if (miniMapInstance.current?.suggestView)
          miniMapInstance.current.suggestView.destroy();
      } catch (err) {}
      miniMapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // reflect profile coordinate changes on the mini-map placemark
    const obj = miniMapInstance.current;
    if (!obj || !obj.placemark) return;
    try {
      const lat = Number(profile.latitude) || Number(mapCenter.lat);
      const lng = Number(profile.longitude) || Number(mapCenter.lng);
      obj.placemark.geometry.setCoordinates([lat, lng]);
      if (obj.map) obj.map.setCenter([lat, lng]);
    } catch (err) {}
  }, [profile.latitude, profile.longitude]);

  const requestCode = (event) => {
    event.preventDefault();
    if (!phoneDraft.trim()) {
      onNotify?.("Введите телефон", "Телефон нужен для входа мастера.");
      return;
    }
    setAuthStep("code");
    onNotify?.("Код для MVP", "Введите фиксированный код 1111.");
  };

  const verifyPhone = (event) => {
    event.preventDefault();
    if (codeDraft !== "1111") {
      onNotify?.("Неверный код", "Для разработки используется код 1111.");
      return;
    }
    setVerifiedPhone(phoneDraft.trim());
    updateProfile("phone", phoneDraft.trim());
    setAuthStep("verified");
    onNotify?.(
      "Телефон подтвержден",
      "Теперь можно редактировать профиль мастера.",
    );
  };

  const saveProfile = () => {
    setSavedProfile(profile);
    setIsSaved(true);
    onNotify?.("Профиль сохранен", "Данные мастера сохранены в localStorage.");
  };

  const resetProfile = () => {
    setProfile(emptyProfile);
    setSavedProfile(null);
    setStep(0);
    setIsSaved(false);
    setVerifiedPhone("");
    setAuthStep("phone");
    setPhoneDraft("");
    setCodeDraft("");
    onNotify?.("Черновик очищен", "Можно заполнить профиль заново.");
  };

  return (
    <section
      id="master-register"
      className="min-h-[calc(100svh-64px)] bg-gray-50 py-8 md:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <a
              href="#top"
              className="mb-4 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100"
            >
              ← Вернуться к карте
            </a>
            <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">
              Регистрация мастера
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
              Заполните минимум данных, посмотрите как будет выглядеть профиль,
              затем сохраните или вернитесь к редактированию.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm">
            Шаг {step + 1} из {steps.length}
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-full bg-white">
          <div
            className="h-2 rounded-full bg-indigo-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            {authStep !== "verified" && (
              <div className="mb-6 rounded-[24px] border border-indigo-100 bg-indigo-50 p-4">
                <h2 className="text-lg font-semibold text-gray-950">
                  Подтвердите телефон
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Редактирование профиля доступно только после проверки номера.
                  Код MVP: 1111.
                </p>
                {authStep === "phone" ? (
                  <form onSubmit={requestCode} className="mt-4 flex gap-2">
                    <input
                      value={phoneDraft}
                      onChange={(event) =>
                        setPhoneDraft(formatKzPhone(event.target.value))
                      }
                      className="min-w-0 flex-1 rounded-2xl border border-indigo-100 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                      placeholder="+7 (777) 000-00-00"
                    />
                    <button className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white">
                      Код
                    </button>
                  </form>
                ) : (
                  <form onSubmit={verifyPhone} className="mt-4 flex gap-2">
                    <input
                      value={codeDraft}
                      onChange={(event) => setCodeDraft(event.target.value)}
                      className="min-w-0 flex-1 rounded-2xl border border-indigo-100 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                      placeholder="1111"
                    />
                    <button className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white">
                      Подтвердить
                    </button>
                  </form>
                )}
              </div>
            )}

            {authStep === "verified" && (
              <>
                <div className="mb-5 grid grid-cols-3 gap-2">
                  {steps.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setStep(index)}
                      className={`${step === index ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-500"} rounded-2xl px-3 py-3 text-left transition`}
                    >
                      <div className="text-xs font-bold">
                        {index + 1}. {item.title}
                      </div>
                      <div className="mt-1 hidden text-[11px] opacity-80 sm:block">
                        {item.hint}
                      </div>
                    </button>
                  ))}
                </div>

                {step === 0 && (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-gray-500">
                        Телефон для входа
                      </span>
                      <input
                        value={profile.phone}
                        onChange={(event) =>
                          updateProfile(
                            "phone",
                            formatKzPhone(event.target.value),
                          )
                        }
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        placeholder="+7 (777) 000-00-00"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-gray-500">
                        Имя или название студии
                      </span>
                      <input
                        value={profile.name}
                        onChange={(event) =>
                          updateProfile("name", event.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        placeholder="Например, Алия Камалова"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-gray-500">
                        О себе
                      </span>
                      <textarea
                        value={profile.about}
                        onChange={(event) =>
                          updateProfile("about", event.target.value)
                        }
                        className="min-h-28 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        placeholder="Опыт, специализация, условия приема"
                      />
                    </label>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <span className="mb-2 block text-xs font-medium text-gray-500">
                        Главная категория
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {categories
                          .filter((category) => category !== "Все")
                          .map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() =>
                                updateProfile("category", category)
                              }
                              className={`${profile.category === category ? "bg-indigo-500 text-white" : "border border-gray-200 bg-white text-gray-700"} rounded-2xl px-3 py-3 text-sm font-semibold`}
                            >
                              {category}
                            </button>
                          ))}
                      </div>
                    </div>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-gray-500">
                        Адрес или точка на карте
                      </span>
                      <input
                        ref={addressRef}
                        value={profile.address}
                        onChange={(event) =>
                          updateProfile("address", event.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        placeholder="Костанай, улица..."
                      />
                    </label>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                      <div className="mb-2 text-xs font-semibold text-gray-500">
                        Подсказки адресов
                      </div>
                      <div className="space-y-2">
                        {addressMatches.map((item) => (
                          <button
                            key={item.address}
                            type="button"
                            onClick={() => chooseAddress(item)}
                            className="block w-full rounded-xl bg-white px-3 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            {item.address}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-[11px] text-gray-400">
                        Сейчас это frontend-заглушка. Для настоящих подсказок
                        подключим Yandex/2GIS Suggest API с ключом.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={profile.latitude}
                        onChange={(event) =>
                          updateProfile("latitude", event.target.value)
                        }
                        className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        placeholder="latitude"
                      />
                      <input
                        value={profile.longitude}
                        onChange={(event) =>
                          updateProfile("longitude", event.target.value)
                        }
                        className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        placeholder="longitude"
                      />
                    </div>
                    <div
                      ref={miniMapRef}
                      onClick={setMarkerByClick}
                      className="relative h-44 w-full overflow-hidden rounded-3xl border border-indigo-100 bg-[#e8f0e4] text-left"
                    >
                      <div
                        className="absolute inset-0 opacity-70 pointer-events-none"
                        style={{
                          backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                          backgroundSize: "44px 44px",
                        }}
                      />
                      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500 shadow-lg ring-4 ring-pink-200 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 px-3 py-2 text-xs text-gray-600 pointer-events-none">
                        Нажмите по мини-карте или перетащите метку, чтобы
                        вручную поставить метку.
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={profile.whatsapp}
                        onChange={(event) =>
                          updateProfile("whatsapp", event.target.value)
                        }
                        className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        placeholder="WhatsApp"
                      />
                      <input
                        value={profile.telegram}
                        onChange={(event) =>
                          updateProfile("telegram", event.target.value)
                        }
                        className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        placeholder="Telegram"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <ProfilePreview profile={profile} isSaved={isSaved} />
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((current) => current - 1)}
                      className="rounded-2xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700"
                    >
                      Назад
                    </button>
                  )}
                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep((current) => current + 1)}
                      className="flex-1 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Продолжить
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-200"
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        onClick={saveProfile}
                        className="flex-1 rounded-2xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white"
                      >
                        Сохранить профиль
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={resetProfile}
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-400 ring-1 ring-gray-200"
                  >
                    Сбросить
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProfilePreview profile={profile} isSaved={isSaved} />
            <div className="mt-4 rounded-[28px] border border-pink-100 bg-pink-50 p-5">
              <h3 className="font-semibold text-gray-950">
                Что будет после сохранения
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                В настоящей версии профиль появится на карте, координаты
                сохранятся в БД, а мастер сможет подключить Twins PRO в личном
                кабинете.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
