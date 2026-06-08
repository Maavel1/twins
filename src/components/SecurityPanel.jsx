export default function SecurityPanel({ role = "client" }) {
  const items =
    role === "master"
      ? [
          { title: "Телефон подтверждён", text: "Редактирование профиля доступно только после OTP." },
          { title: "Лимит попыток кода", text: "5 неверных кодов — блокировка на 3 минуты." },
          { title: "Одна роль", text: "Мастер и клиент не могут быть активны одновременно." },
          { title: "Локальные данные", text: "Статистика хранится в браузере до подключения backend." },
        ]
      : [
          { title: "Вход по SMS", text: "Пароль не нужен — только номер и код подтверждения." },
          { title: "Защита от перебора", text: "Лимит попыток кода и задержка между запросами." },
          { title: "Маскирование номера", text: "В профиле показываем номер частично скрытым." },
          { title: "Одна роль", text: "Клиентский и мастерский вход не совмещаются." },
        ];

  return (
    <div className="rounded-[28px] border border-indigo-100 bg-indigo-50/50 p-5">
      <h3 className="text-sm font-semibold text-gray-950">🔒 Безопасность аккаунта</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl bg-white/80 p-3">
            <div className="text-xs font-semibold text-indigo-700">{item.title}</div>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
