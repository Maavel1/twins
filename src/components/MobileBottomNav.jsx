export default function MobileBottomNav({ client, masterLoggedIn }) {
  const profileHref = masterLoggedIn
    ? "#master-profile"
    : client
      ? "#client-profile"
      : "#client-auth";
  const profileLabel = masterLoggedIn ? "Кабинет" : client ? "Профиль" : "Войти";

  const items = [
    { label: "Карта", href: "#top", icon: "⌖" },
    { label: "Каталог", href: "#catalog", icon: "☰" },
    { label: "PRO", href: "#pricing", icon: "↑" },
    { label: profileLabel, href: profileHref, icon: "●" },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-30 rounded-[24px] border border-white/70 bg-white/95 p-1.5 shadow-2xl backdrop-blur pb-[max(0.375rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => (
          <a
            key={item.href + item.label}
            href={item.href}
            className="flex min-w-0 flex-col items-center justify-center rounded-[18px] px-2 py-2 text-center text-[11px] font-semibold text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <span className="mb-0.5 text-sm leading-none">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
