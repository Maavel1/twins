import { useState } from "react";
import { formatKzPhone } from "../utils/phone.js";

export default function ClientAuth({ clients, onSaveClients, onLogin, onNotify }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const existingClient = clients.find((client) => client.phone === phone.trim());

  const submitPhone = (event) => {
    event.preventDefault();
    if (!phone.trim()) {
      onNotify?.("Введите телефон", "Телефон будет уникальным идентификатором клиента.");
      return;
    }
    setStep("code");
    onNotify?.("Код для MVP", "Введите фиксированный код 1111.");
  };

  const submitCode = (event) => {
    event.preventDefault();
    if (code !== "1111") {
      onNotify?.("Неверный код", "Для разработки используется код 1111.");
      return;
    }
    if (existingClient) {
      onLogin(existingClient);
      onNotify?.("С возвращением", `${existingClient.name}, вы вошли в профиль.`);
      window.location.hash = "#top";
      return;
    }
    setStep("name");
  };

  const submitName = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      onNotify?.("Введите имя", "Мастеру нужно понимать, как к вам обращаться.");
      return;
    }
    const newClient = { id: Date.now(), phone: phone.trim(), name: name.trim() };
    onSaveClients([...clients, newClient]);
    onLogin(newClient);
    onNotify?.("Профиль клиента готов", "Вы вошли без пароля и почты.");
    window.location.hash = "#top";
  };

  return (
    <section className="min-h-[calc(100svh-64px)] bg-gray-50 py-8 md:py-14">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <a href="#top" className="mb-4 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
            ← На карту
          </a>
          <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">Вход клиента</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Никаких паролей, почты и капчи. На MVP используем фиксированный код `1111`, чтобы не тратить деньги на SMS.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          {step === "phone" && (
            <form onSubmit={submitPhone} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">Номер телефона</span>
                <input value={phone} onChange={(event) => setPhone(formatKzPhone(event.target.value))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400" placeholder="+7 (707) 000-00-12" />
              </label>
              <button className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white">Получить код</button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={submitCode} className="space-y-4">
              <div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-700">Введите код 1111</div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">Код подтверждения</span>
                <input value={code} onChange={(event) => setCode(event.target.value)} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400" placeholder="1111" />
              </label>
              <button className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white">Продолжить</button>
            </form>
          )}

          {step === "name" && (
            <form onSubmit={submitName} className="space-y-4">
              <div className="rounded-2xl bg-pink-50 p-4 text-sm text-pink-700">Номер новый. Как к вам обращаться?</div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">Имя</span>
                <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400" placeholder="Например, Максим" />
              </label>
              <button className="w-full rounded-2xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white">Войти</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
