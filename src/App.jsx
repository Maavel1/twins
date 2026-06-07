import { useEffect, useMemo, useRef, useState } from "react";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import MastersSection from "./components/MastersSection.jsx";
import MobileMap from "./components/MobileMap.jsx";
import Modal from "./components/Modal.jsx";
import Pricing from "./components/Pricing.jsx";
import MasterPortal from "./components/MasterPortal.jsx";
import Toast from "./components/Toast.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import ClientAuth from "./components/ClientAuth.jsx";
import ClientProfile from "./components/ClientProfile.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import { masters } from "./data/siteData.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [sortMode, setSortMode] = useState("pro");
  const [route, setRoute] = useState(() => {
    if (window.location.hash === "#master-register") return "master";
    if (window.location.hash === "#client-auth") return "clientAuth";
    if (window.location.hash === "#client-profile") return "clientProfile";
    return "home";
  });
  const [geoStatus, setGeoStatus] = useState("requesting");
  const [userLocation, setUserLocation] = useState(null);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [favoriteIds, setFavoriteIds] = useLocalStorage("twins:favorites", []);
  const [leads, setLeads] = useLocalStorage("twins:leads", []);
  const [clients, setClients] = useLocalStorage("twins:clients", []);
  const [clientSession, setClientSession] = useLocalStorage(
    "twins:clientSession",
    null,
  );
  const [savedMasterProfile] = useLocalStorage("twins:masterProfile", null);
  const [viewedMasterIds, setViewedMasterIds] = useLocalStorage(
    "twins:viewedMasters",
    [],
  );
  const [reviews, setReviews] = useLocalStorage("twins:reviews", []);
  const [toast, setToast] = useState(null);
  const touchStartY = useRef(0);

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
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    setIsMobileDevice(isMobile);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
      setCanInstall(true);
      setShowInstallModal(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setInstallPromptEvent(null);
      setShowInstallModal(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#master-register") setRoute("master");
      else if (window.location.hash === "#client-auth") setRoute("clientAuth");
      else if (window.location.hash === "#client-profile")
        setRoute("clientProfile");
      else setRoute("home");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const filteredMasters = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const allMasters = (() => {
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
    })();

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
  }, [favoriteIds, searchQuery, selectedCategory, sortMode]);

  const mapQuery =
    searchQuery.trim() || (selectedCategory === "Все" ? "" : selectedCategory);

  const openModal = (type, master = null) => {
    setMobileMenuOpen(false);
    setModal({ type, master });
  };

  const openMasterProfile = (master) => {
    setViewedMasterIds((current) =>
      [master.id, ...current.filter((id) => id !== master.id)].slice(0, 5),
    );
    openModal("profile", master);
  };

  const showToast = (title, text = "") => {
    setToast({ title, text });
    window.setTimeout(() => setToast(null), 3500);
  };

  const handleInstall = async () => {
    const isIos =
      typeof navigator !== "undefined" &&
      /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (!installPromptEvent) {
      if (isIos) {
        showToast(
          "Добавь на главный экран",
          "Нажми «Поделиться» и выбери «На экран «Домой»».",
        );
      } else {
        showToast("Установка недоступна", "Ожидайте подсказку браузера.");
      }
      return;
    }

    setShowInstallModal(false);
    installPromptEvent.prompt();
    const choiceResult = await installPromptEvent.userChoice;
    setCanInstall(false);
    setInstallPromptEvent(null);

    if (choiceResult.outcome === "accepted") {
      showToast("Приложение установлено", "Twins добавлен на главный экран.");
    } else {
      showToast("Установка отменена", "Вы можете установить приложение позже.");
    }
  };

  const toggleFavorite = (master) => {
    setFavoriteIds((current) => {
      const exists = current.includes(master.id);
      showToast(
        exists ? "Удалено из избранного" : "Добавлено в избранное",
        master.name,
      );
      return exists
        ? current.filter((id) => id !== master.id)
        : [...current, master.id];
    });
  };

  const saveLead = (lead) => {
    setLeads((current) => [
      { id: Date.now(), createdAt: new Date().toISOString(), ...lead },
      ...current,
    ]);
    showToast(
      "Заявка сохранена",
      "Это frontend-заглушка. В backend она уйдет позже.",
    );
    setModal(null);
  };

  const requireClientAuth = () => {
    showToast(
      "Нужен вход клиента",
      "Войдите по номеру телефона. Код для MVP: 1111.",
    );
    window.location.hash = "#client-auth";
  };

  const submitReview = ({ master, rating, comment }) => {
    if (!clientSession) {
      requireClientAuth();
      return false;
    }

    const now = Date.now();
    const lastReview = reviews.find(
      (review) =>
        review.masterId === master.id && review.clientId === clientSession.id,
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
        clientId: clientSession.id,
        clientName: clientSession.name,
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

  const handleSheetTouchStart = (event) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleSheetTouchEnd = (event) => {
    const delta = event.changedTouches[0].clientY - touchStartY.current;
    if (delta < -50) setSheetOpen(true);
    if (delta > 50) setSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-white pb-24 text-gray-900 antialiased md:pb-0">
      <Header
        isMenuOpen={mobileMenuOpen}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        client={clientSession}
        onCityUnavailable={(city) =>
          showToast(
            "Город скоро появится",
            `${city} пока в ожидании. Сейчас доступен Костанай.`,
          )
        }
        canInstall={canInstall || isMobileDevice}
        onInstall={handleInstall}
      />
      {route === "master" ? (
        <main>
          <MasterPortal onNotify={showToast} />
        </main>
      ) : route === "clientAuth" ? (
        <main>
          <ClientAuth
            clients={clients}
            onSaveClients={setClients}
            onLogin={setClientSession}
            onNotify={showToast}
          />
        </main>
      ) : route === "clientProfile" ? (
        <main>
          <ClientProfile
            client={clientSession}
            masters={masters}
            favoriteIds={favoriteIds}
            viewedIds={viewedMasterIds}
            onOpenMaster={(master) => {
              window.location.hash = "#top";
              openMasterProfile(master);
            }}
            onLogout={logoutClient}
          />
        </main>
      ) : (
        <main>
          <Hero
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            mapQuery={mapQuery}
            geoStatus={geoStatus}
            userLocation={userLocation}
            filteredMasters={filteredMasters}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            onBooking={(master) => openModal("booking", master)}
            onProfile={openMasterProfile}
            onContact={(master) => openModal("contact", master)}
          />
          <MobileMap
            sheetOpen={sheetOpen}
            onSheetToggle={() => setSheetOpen((open) => !open)}
            onTouchStart={handleSheetTouchStart}
            onTouchEnd={handleSheetTouchEnd}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            mapQuery={mapQuery}
            geoStatus={geoStatus}
            userLocation={userLocation}
            filteredMasters={filteredMasters}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            onBooking={(master) => openModal("booking", master)}
            onProfile={openMasterProfile}
            onContact={(master) => openModal("contact", master)}
          />
          <MastersSection
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortMode={sortMode}
            onSortChange={setSortMode}
            filteredMasters={filteredMasters}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            onBooking={(master) => openModal("booking", master)}
            onProfile={openMasterProfile}
            onContact={(master) => openModal("contact", master)}
          />
          <HowItWorks />
          <Pricing onModalOpen={(type) => openModal(type)} />
        </main>
      )}
      <Footer />
      <Modal
        modal={modal}
        onClose={() => setModal(null)}
        onSubmitLead={saveLead}
        client={clientSession}
        reviews={reviews}
        onSubmitReview={submitReview}
        onShareMaster={shareMaster}
        onRequireClientAuth={requireClientAuth}
        favoriteIds={favoriteIds}
        onFavoriteToggle={toggleFavorite}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
      <InstallPrompt
        isOpen={showInstallModal}
        isMobileDevice={isMobileDevice}
        onInstall={handleInstall}
        onClose={() => setShowInstallModal(false)}
      />
      <MobileBottomNav />
    </div>
  );
}
