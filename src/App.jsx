import { useEffect, useMemo, useState } from "react";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import MastersSection from "./components/MastersSection.jsx";
import MobileMap from "./components/MobileMap.jsx";
import Modal from "./components/Modal.jsx";
import Pricing from "./components/Pricing.jsx";
import MasterPortal from "./components/MasterPortal.jsx";
import MasterDashboard from "./components/MasterDashboard.jsx";
import Toast from "./components/Toast.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import ClientAuth from "./components/ClientAuth.jsx";
import ClientProfile from "./components/ClientProfile.jsx";
import MastersCatalog from "./components/MastersCatalog.jsx";
import SupportPage from "./components/SupportPage.jsx";
import { masters } from "./data/siteData.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { getDefaultMasterStats } from "./utils/masterStats.js";
import { limitListSize, throttleAction } from "./utils/security.js";
import { validateSearch } from "./utils/input.js";
import { consumeAuthReturn, saveAuthReturn } from "./utils/clientAuth.js";
import { isValidClientSession, isValidMasterSession } from "./utils/session.js";
import GuestPromptBanner from "./components/GuestPromptBanner.jsx";

function resolveRoute() {
  const hash = window.location.hash;
  if (hash === "#master-register") return "master";
  if (hash === "#master-profile") return "masterProfile";
  if (hash === "#client-auth") return "clientAuth";
  if (hash === "#client-profile") return "clientProfile";
  if (hash === "#catalog") return "catalog";
  if (hash === "#support") return "support";
  return "home";
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [sortMode, setSortMode] = useState("pro");
  const [route, setRoute] = useState(resolveRoute);
  const [geoStatus, setGeoStatus] = useState("requesting");
  const [userLocation, setUserLocation] = useState(null);
  const [favoriteIds, setFavoriteIds] = useLocalStorage("twins:favorites", []);
  const [leads, setLeads] = useLocalStorage("twins:leads", []);
  const [clients, setClients] = useLocalStorage("twins:clients", []);
  const [clientSession, setClientSession] = useLocalStorage(
    "twins:clientSession",
    null,
  );
  const [savedMasterProfile] = useLocalStorage("twins:masterProfile", null);
  const [masterVerifiedPhone, setMasterVerifiedPhone] = useLocalStorage(
    "twins:masterVerifiedPhone",
    "",
  );
  const [masterLoggedInFlag, setMasterLoggedInFlag] = useLocalStorage(
    "twins:masterLoggedIn",
    false,
  );
  const [masterStatsMap, setMasterStatsMap] = useLocalStorage(
    "twins:masterStats",
    {},
  );
  const [viewedMasterIds, setViewedMasterIds] = useLocalStorage(
    "twins:viewedMasters",
    [],
  );
  const [reviews, setReviews] = useLocalStorage("twins:reviews", []);
  const [, setProStatus] = useLocalStorage("twins:masterProStatus", null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        });
        setGeoStatus("allowed");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 8000 },
    );
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setMobileMenuOpen(false);
      setRoute(resolveRoute());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const openMastersSheetOnMobile = () => {
      if (
        window.location.hash === "#masters" &&
        window.matchMedia("(max-width: 767px)").matches
      ) {
        setSheetOpen(true);
      }
    };

    window.addEventListener("hashchange", openMastersSheetOnMobile);
    return () => window.removeEventListener("hashchange", openMastersSheetOnMobile);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [route]);

  useEffect(() => {
    if (clientSession && !isValidClientSession(clientSession)) {
      setClientSession(null);
    }
  }, [clientSession, setClientSession]);

  const allMasters = useMemo(() => {
    if (!savedMasterProfile) return masters;
    const saved = savedMasterProfile;
    const id = saved.id ?? 99999;
    const name = saved.name || "Новый мастер";
    const initials = (name || "НМ").slice(0, 2).toUpperCase();
    return [
      {
        id,
        name,
        initials,
        service: saved.about || `${saved.category} услуги`,
        category: saved.category || "Другие",
        tags: [],
        price: "—",
        rating: "0",
        distance: "—",
        schedule: "—",
        whatsapp: saved.whatsapp || "",
        telegram: saved.telegram || "",
        pro: false,
        color: "bg-pink-100 text-pink-700",
        latitude: saved.latitude,
        longitude: saved.longitude,
      },
      ...masters,
    ];
  }, [savedMasterProfile]);

  const filteredMasters = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const result = allMasters.filter((master) => {
      const categoryMatches =
        selectedCategory === "Все" || master.category === selectedCategory;
      const searchText = [
        master.name,
        master.service,
        master.category,
        ...master.tags,
      ]
        .join(" ")
        .toLowerCase();
      return (
        categoryMatches &&
        (!normalizedQuery || searchText.includes(normalizedQuery))
      );
    });

    return result.sort((a, b) => {
      if (sortMode === "rating") return Number(b.rating) - Number(a.rating);
      if (sortMode === "distance")
        return Number.parseFloat(a.distance) - Number.parseFloat(b.distance);
      if (sortMode === "favorites")
        return (
          Number(favoriteIds.includes(b.id)) -
          Number(favoriteIds.includes(a.id))
        );
      return (
        Number(b.pro) - Number(a.pro) || Number(b.rating) - Number(a.rating)
      );
    });
  }, [allMasters, favoriteIds, searchQuery, selectedCategory, sortMode]);

  const mapQuery =
    searchQuery.trim() || (selectedCategory === "Все" ? "" : selectedCategory);

  const masterRegistered = Boolean(savedMasterProfile);
  const masterSessionActive = isValidMasterSession(
    savedMasterProfile,
    masterVerifiedPhone,
    masterLoggedInFlag,
  );
  const clientSessionActive =
    isValidClientSession(clientSession) && !masterSessionActive;
  const activeClient = clientSessionActive ? clientSession : null;

  useEffect(() => {
    if (masterSessionActive && clientSession) {
      setClientSession(null);
    }
  }, [masterSessionActive, clientSession, setClientSession]);

  const showToast = (title, text = "") => {
    setToast({ title, text });
    window.setTimeout(() => setToast(null), 3500);
  };

  const activateMasterSession = () => {
    setClientSession(null);
    setMasterLoggedInFlag(true);
  };

  const loginClient = (client) => {
    setMasterVerifiedPhone("");
    setMasterLoggedInFlag(false);
    setClientSession(client);
    window.location.hash = consumeAuthReturn("#top");
  };

  const logoutMaster = () => {
    setMasterVerifiedPhone("");
    setMasterLoggedInFlag(false);
    showToast("Вы вышли", "Сессия мастера завершена. Профиль сохранён.");
    window.location.hash = "#top";
  };

  const handleSearchChange = (value) => {
    const { value: safe, error } = validateSearch(value);
    setSearchQuery(safe);
    if (error) showToast("Поиск", error);
  };

  const bumpMasterStat = (masterId, field) => {
    if (!masterId) return;
    setMasterStatsMap((current) => {
      const prev = current[masterId] ?? getDefaultMasterStats();
      return {
        ...current,
        [masterId]: { ...prev, [field]: prev[field] + 1 },
      };
    });
  };

  const openModal = (type, master = null) => {
    setMobileMenuOpen(false);
    setModal({ type, master });
  };

  const openMasterProfile = (master) => {
    bumpMasterStat(master.id, "profileViews");
    setViewedMasterIds((current) =>
      limitListSize(
        [master.id, ...current.filter((id) => id !== master.id)],
        50,
      ),
    );
    openModal("profile", master);
  };

  const openMasterContact = (master) => {
    openModal("contact", master);
  };

  const openBookingModal = (master) => {
    if (!requireClientAuth("записаться к мастеру")) return;
    openModal("booking", master);
  };

  const trackContactClick = (master) => {
    bumpMasterStat(master.id, "contactClicks");
  };

  const toggleFavorite = (master) => {
    if (!requireClientAuth("добавлять в избранное")) return;
    const throttle = throttleAction(`favorite:${master.id}`, 500);
    if (!throttle.allowed) {
      showToast("Подождите", throttle.message);
      return;
    }
    setFavoriteIds((current) => {
      const exists = current.includes(master.id);
      showToast(
        exists ? "Удалено из избранного" : "Добавлено в избранное",
        master.name,
      );
      const next = exists
        ? current.filter((id) => id !== master.id)
        : [...current, master.id];
      return limitListSize(next, 100);
    });
  };

  const saveLead = (lead) => {
    if (lead.type !== "pro" && !requireClientAuth("оставить заявку")) return;
    const throttle = throttleAction("lead:submit", 2000);
    if (!throttle.allowed) {
      showToast("Подождите", throttle.message);
      return;
    }
    setLeads((current) =>
      limitListSize(
        [
          {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            clientId: activeClient?.id ?? null,
            clientName: activeClient?.name ?? lead.name ?? "",
            clientPhone: activeClient?.phone ?? lead.phone ?? "",
            ...lead,
          },
          ...current,
        ],
        200,
      ),
    );
    showToast(
      "Заявка сохранена",
      "Это frontend-заглушка. В backend она уйдет позже.",
    );
    if (lead.type === "pro") {
      setProStatus("pending");
    }
    setModal(null);
  };

  const requireClientAuth = (action = "") => {
    if (masterSessionActive) {
      showToast(
        "Сначала выйдите из кабинета мастера",
        "В Twins одна роль за раз. Завершите сессию мастера, чтобы действовать как клиент.",
      );
      window.location.hash = "#master-profile";
      return false;
    }
    if (activeClient) return true;
    saveAuthReturn(window.location.hash || "#top");
    showToast(
      "Нужна регистрация",
      action
        ? `Войдите как клиент, чтобы ${action}. Регистрация за 15 секунд.`
        : "Войдите по номеру телефона. Код для MVP: 1111.",
    );
    setModal(null);
    window.location.hash = "#client-auth";
    return false;
  };

  const handleSortChange = (mode) => {
    if (mode === "favorites" && !activeClient) {
      requireClientAuth("смотреть избранное");
      return;
    }
    setSortMode(mode);
  };

  const submitReview = ({ master, rating, comment }) => {
    if (!activeClient) {
      requireClientAuth();
      return false;
    }

    const now = Date.now();
    const lastReview = reviews.find(
      (review) =>
        review.masterId === master.id && review.clientId === activeClient.id,
    );
    if (lastReview && now - lastReview.createdAt < 24 * 60 * 60 * 1000) {
      showToast(
        "Отзыв уже есть",
        "Повторный отзыв одному мастеру доступен через 24 часа.",
      );
      return false;
    }

    setReviews((current) => [
      {
        id: now,
        masterId: master.id,
        clientId: activeClient.id,
        clientName: activeClient.name,
        rating,
        comment,
        createdAt: now,
      },
      ...current,
    ]);
    showToast("Отзыв опубликован", `${rating} ★ для ${master.name}`);
    return true;
  };

  const shareMaster = async (master) => {
    const data = {
      title: `${master.name} в Twins`,
      text: `${master.name}: ${master.service}`,
      url: `https://twins.ru/master/${master.id}`,
    };

    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
      showToast(
        "Ссылка готова",
        navigator.share
          ? "Открылось системное окно отправки."
          : "Ссылка скопирована.",
      );
    } catch {
      showToast("Шеринг отменен", "Действие не завершено.");
    }
  };

  const logoutClient = () => {
    setClientSession(null);
    showToast("Вы вышли", "Локальная сессия клиента очищена.");
    window.location.hash = "#top";
  };

  const masterId = savedMasterProfile?.id ?? 99999;
  const masterStats =
    masterStatsMap[masterId] ?? getDefaultMasterStats();
  const masterFavoriteCount = favoriteIds.filter((id) => id === masterId).length;

  return (
    <div className="min-h-screen bg-white pb-24 text-gray-900 antialiased md:pb-0">
      <Header
        isMenuOpen={mobileMenuOpen}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        client={activeClient}
        masterRegistered={masterRegistered}
        masterLoggedIn={masterSessionActive}
        onCityUnavailable={(city) =>
          showToast(
            "Город скоро появится",
            `${city} пока в ожидании. Сейчас доступен Костанай.`,
          )
        }
      />
      {route === "master" ? (
        <main>
          <MasterPortal
            onNotify={showToast}
            blockedByClient={clientSessionActive}
            masterLoggedIn={masterSessionActive}
            onMasterActivate={activateMasterSession}
          />
        </main>
      ) : route === "masterProfile" ? (
        <main>
          {!masterSessionActive ? (
            <section className="min-h-[calc(100svh-64px)] bg-gray-50 px-4 py-10 pb-28">
              <div className="mx-auto max-w-md tw-panel p-6 text-center">
                <h1 className="text-xl font-semibold text-gray-950">Войдите как мастер</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Сессия завершена. Подтвердите телефон, чтобы снова открыть кабинет.
                </p>
                <a
                  href="#master-register"
                  className="mt-5 inline-flex rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white"
                >
                  Войти как мастер
                </a>
              </div>
            </section>
          ) : (
          <MasterDashboard
            profile={savedMasterProfile}
            stats={masterStats}
            favoriteCount={masterFavoriteCount}
            allMasters={allMasters}
            leads={leads}
            onEditProfile={() => {
              window.location.hash = "#master-register";
            }}
            onLogout={logoutMaster}
            onNotify={showToast}
            onPreviewProfile={() => {
              const master = allMasters.find((item) => item.id === masterId);
              if (master) openModal("profile", master);
              else showToast("Профиль не найден", "Сохраните профиль ещё раз.");
            }}
            onShareProfile={() => {
              const master = allMasters.find((item) => item.id === masterId);
              if (master) shareMaster(master);
            }}
            onApplyPro={() => openModal("pro")}
          />
          )}
        </main>
      ) : route === "clientAuth" ? (
        <main>
          {masterSessionActive ? (
            <section className="min-h-[calc(100svh-64px)] bg-gray-50 px-4 py-10 pb-28">
              <div className="mx-auto max-w-md tw-panel p-6 text-center">
                <h1 className="text-xl font-semibold text-gray-950">Вход клиента недоступен</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Вы вошли как мастер. Выйдите из кабинета мастера, чтобы войти как клиент.
                </p>
                <a href="#master-profile" className="mt-5 inline-flex rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white">
                  Кабинет мастера
                </a>
              </div>
            </section>
          ) : (
            <ClientAuth
              clients={clients}
              onSaveClients={setClients}
              onLogin={loginClient}
              onNotify={showToast}
              blockedByMaster={masterSessionActive}
            />
          )}
        </main>
      ) : route === "clientProfile" ? (
        <main>
          {masterSessionActive ? (
            <section className="min-h-[calc(100svh-64px)] bg-gray-50 px-4 py-10 pb-28">
              <div className="mx-auto max-w-md rounded-[28px] bg-white p-6 text-center shadow-sm">
                <h1 className="text-xl font-semibold text-gray-950">Профиль клиента недоступен</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Вы вошли как мастер. Клиентский кабинет открывается только в режиме клиента.
                </p>
                <a
                  href="#master-profile"
                  className="mt-5 inline-flex rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white"
                >
                  Кабинет мастера
                </a>
              </div>
            </section>
          ) : (
            <ClientProfile
              client={activeClient}
              masters={allMasters}
              favoriteIds={favoriteIds}
              viewedIds={viewedMasterIds}
              leads={leads}
              onOpenMaster={openMasterProfile}
              onLogout={logoutClient}
              onNotify={showToast}
            />
          )}
        </main>
      ) : route === "catalog" ? (
        <main>
          {!activeClient && !masterSessionActive && (
            <GuestPromptBanner onLogin={() => requireClientAuth()} />
          )}
          <MastersCatalog
            allMasters={allMasters}
            favoriteIds={favoriteIds}
            geoStatus={geoStatus}
            userLocation={userLocation}
            onFavoriteToggle={toggleFavorite}
            onBooking={openBookingModal}
            onProfile={openMasterProfile}
            onContact={openMasterContact}
            clientLoggedIn={Boolean(activeClient)}
            onRequireClientAuth={requireClientAuth}
          />
        </main>
      ) : route === "support" ? (
        <main>
          <SupportPage />
        </main>
      ) : (
        <main>
          {!activeClient && !masterSessionActive && (
            <GuestPromptBanner onLogin={() => requireClientAuth()} />
          )}
          <Hero
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={handleSearchChange}
            onCategoryChange={setSelectedCategory}
            mapQuery={mapQuery}
            geoStatus={geoStatus}
            userLocation={userLocation}
            filteredMasters={filteredMasters}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            onBooking={openBookingModal}
            onProfile={openMasterProfile}
            onContact={openMasterContact}
            clientLoggedIn={Boolean(activeClient)}
          />
          <MobileMap
            sheetOpen={sheetOpen}
            onSheetToggle={() => setSheetOpen((open) => !open)}
            onSheetOpen={() => setSheetOpen(true)}
            onSheetClose={() => setSheetOpen(false)}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortMode={sortMode}
            onSearchChange={handleSearchChange}
            onCategoryChange={setSelectedCategory}
            onSortChange={handleSortChange}
            mapQuery={mapQuery}
            geoStatus={geoStatus}
            userLocation={userLocation}
            filteredMasters={filteredMasters}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            onBooking={openBookingModal}
            onProfile={openMasterProfile}
            onContact={openMasterContact}
            clientLoggedIn={Boolean(activeClient)}
          />
          <div className="hidden md:block">
            <MastersSection
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              sortMode={sortMode}
              onSortChange={handleSortChange}
              filteredMasters={filteredMasters}
              favoriteIds={favoriteIds}
              onFavoriteToggle={toggleFavorite}
              onBooking={openBookingModal}
              onProfile={openMasterProfile}
              onContact={openMasterContact}
              clientLoggedIn={Boolean(activeClient)}
            />
          </div>
          <HowItWorks />
          <Pricing onModalOpen={(type) => openModal(type)} />
        </main>
      )}
      <Footer />
      <Modal
        modal={modal}
        onClose={() => setModal(null)}
        onSubmitLead={saveLead}
        client={activeClient}
        reviews={reviews}
        onSubmitReview={submitReview}
        onShareMaster={shareMaster}
        onRequireClientAuth={requireClientAuth}
        favoriteIds={favoriteIds}
        onFavoriteToggle={toggleFavorite}
        onContactClick={trackContactClick}
        onOpenContact={openMasterContact}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
      <MobileBottomNav
        client={activeClient}
        masterLoggedIn={masterSessionActive}
      />
    </div>
  );
}
