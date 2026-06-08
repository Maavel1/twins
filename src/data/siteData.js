export const navItems = [
  { label: "Каталог", href: "#catalog" },
  { label: "Мастера", href: "#masters" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Поддержка", href: "#support" },
];

export const footerLinks = [
  { label: "О проекте", href: "#how" },
  { label: "Каталог", href: "#catalog" },
  { label: "Поддержка", href: "#support" },
  { label: "Конфиденциальность", href: "#support" },
];

export const supportContacts = [
  { icon: "💬", label: "WhatsApp", hint: "Быстрые ответы", href: "https://wa.me/77000000000" },
  { icon: "✈️", label: "Telegram", hint: "@twins_support", href: "https://t.me/twins_support" },
  { icon: "📧", label: "Email", hint: "help@twins.kz", href: "mailto:help@twins.kz" },
];

export const supportFaq = [
  {
    q: "Как записаться к мастеру?",
    a: "Найдите мастера на карте или в каталоге, откройте профиль и нажмите «Связаться» или «Оставить заявку». Мастер получит ваш запрос.",
  },
  {
    q: "Можно ли быть клиентом и мастером одновременно?",
    a: "Нет. В Twins одна активная роль: либо клиент, либо мастер. Чтобы сменить роль — выйдите из текущего аккаунта.",
  },
  {
    q: "Как стать мастером на Twins?",
    a: "Нажмите «Стать мастером», подтвердите телефон кодом и заполните профиль. После сохранения вы появитесь в каталоге.",
  },
  {
    q: "Что такое Twins PRO?",
    a: "PRO — платный статус для мастеров: приоритет в поиске, метка на карте и расширенная статистика. Подробнее в разделе «Тарифы».",
  },
  {
    q: "В каких городах работает Twins?",
    a: "Сейчас сервис доступен в Костанае. Астана, Алматы и другие города подключим позже.",
  },
];

export const categories = [
  "Все",
  "Красота",
  "Ремонт",
  "Здоровье",
  "Обучение",
  "Авто",
  "Дом",
  "Груминг",
];

export const cities = [
  { name: "Костанай", available: true },
  { name: "Астана", available: false },
  { name: "Алматы", available: false },
  { name: "Караганда", available: false },
];

export const kostanayAddressSuggestions = [
  { address: "Костанай, улица Байтурсынова, 67", lat: "53.214350", lng: "63.624630" },
  { address: "Костанай, проспект Аль-Фараби, 90", lat: "53.219400", lng: "63.632100" },
  { address: "Костанай, улица Абая, 34", lat: "53.207900", lng: "63.618800" },
  { address: "Костанай, микрорайон Юбилейный, 12", lat: "53.226500", lng: "63.604300" },
  { address: "Костанай, улица Гоголя, 85", lat: "53.211700", lng: "63.611900" },
];

export const stats = [
  { value: "1 200+", label: "мастеров" },
  { value: "18", label: "категорий" },
  { value: "4.8", label: "средний рейтинг" },
];

export const masters = [
  {
    id: 1,
    name: "Алия Камалова",
    initials: "АК",
    service: "Маникюр и педикюр",
    category: "Красота",
    tags: ["маникюр", "педикюр", "ногти", "красота"],
    price: "от 2 500 ₸",
    rating: "4.9",
    distance: "120 м",
    schedule: "до 20:00",
    whatsapp: "77010000001",
    telegram: "aliya_twins",
    pro: true,
    color: "bg-purple-100 text-indigo-700",
  },
  {
    id: 2,
    name: "Дина Нурлан",
    initials: "ДН",
    service: "Массаж",
    category: "Здоровье",
    tags: ["массаж", "спина", "здоровье", "релакс"],
    price: "от 4 000 ₸",
    rating: "4.8",
    distance: "280 м",
    schedule: "до 21:00",
    whatsapp: "77010000002",
    telegram: "dina_twins",
    pro: true,
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: 3,
    name: "Руслан Сериков",
    initials: "РС",
    service: "Сантехник",
    category: "Ремонт",
    tags: ["сантехник", "ремонт", "трубы", "дом"],
    price: "от 3 000 ₸",
    rating: "4.7",
    distance: "640 м",
    schedule: "сегодня",
    whatsapp: "77010000003",
    telegram: "ruslan_twins",
    pro: false,
    color: "bg-teal-100 text-teal-700",
  },
  {
    id: 4,
    name: "Мадина Сулеймен",
    initials: "МС",
    service: "Брови и макияж",
    category: "Красота",
    tags: ["брови", "макияж", "визаж", "красота"],
    price: "от 2 000 ₸",
    rating: "5.0",
    distance: "900 м",
    schedule: "завтра",
    whatsapp: "77010000004",
    telegram: "madina_twins",
    pro: false,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: 5,
    name: "Ержан Алиев",
    initials: "ЕА",
    service: "Автоэлектрик",
    category: "Авто",
    tags: ["авто", "электрик", "диагностика", "машина"],
    price: "от 5 000 ₸",
    rating: "4.6",
    distance: "1.2 км",
    schedule: "до 19:00",
    whatsapp: "77010000005",
    telegram: "yerzhan_twins",
    pro: false,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 6,
    name: "Айгерим Оспан",
    initials: "АО",
    service: "Репетитор английского",
    category: "Обучение",
    tags: ["английский", "репетитор", "обучение", "дети"],
    price: "от 3 500 ₸",
    rating: "4.9",
    distance: "1.6 км",
    schedule: "онлайн",
    whatsapp: "77010000006",
    telegram: "aigerim_twins",
    pro: true,
    color: "bg-violet-100 text-violet-700",
  },
];

export const howSteps = [
  {
    title: "Ищи на карте",
    text: "Вводишь услугу или выбираешь категорию, а Twins сразу показывает подходящих мастеров рядом.",
    badge: "01",
    meta: "Карта + поиск",
  },
  {
    title: "Сравни мастеров",
    text: "Смотри рейтинг, цену, расстояние, график и PRO-метку, чтобы быстро выбрать подходящего специалиста.",
    badge: "02",
    meta: "Карточки + фильтры",
  },
  {
    title: "Запишись онлайн",
    text: "Оставляешь заявку, выбираешь удобное время и получаешь подтверждение без звонков и переписок.",
    badge: "03",
    meta: "Заявка + WhatsApp",
  },
];

export const proBenefits = [
  "Пульсирующая метка с аватаром на карте",
  "Приоритет в поиске и выдаче",
  "Онлайн-запись и WhatsApp-уведомления",
  "Статистика просмотров профиля",
  "Значок «Проверено Twins»",
];

export const mapCenter = {
  lng: "63.624630",
  lat: "53.214350",
  city: "Костанай",
  address: "Костанай, улица Байтурсынова",
};

export function buildMessengerMessage(master) {
  return `Здравствуйте! Нашел вас в Twins. Хочу записаться на ${master.category}...`;
}

export function buildMessengerLinks(master) {
  const message = encodeURIComponent(buildMessengerMessage(master));

  return {
    whatsapp: `https://wa.me/${master.whatsapp}?text=${message}`,
    telegram: `https://t.me/${master.telegram}?text=${message}`,
  };
}

export function buildYandexMapUrl(query = "", location = null) {
  const lng = location?.lng ?? mapCenter.lng;
  const lat = location?.lat ?? mapCenter.lat;
  const text = `${mapCenter.city}${query ? ` ${query}` : ` ${mapCenter.address}`}`;
  return `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&mode=search&text=${encodeURIComponent(text)}&z=14`;
}

export function buildYandexExternalUrl(query = "", location = null) {
  const lng = location?.lng ?? mapCenter.lng;
  const lat = location?.lat ?? mapCenter.lat;
  const text = `${mapCenter.city}${query ? ` ${query}` : ` ${mapCenter.address}`}`;
  return `https://yandex.ru/maps/?ll=${lng}%2C${lat}&mode=search&text=${encodeURIComponent(text)}&z=14`;
}
