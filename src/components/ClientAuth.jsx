import { useState } from "react";
import {
  formatKzPhone,
  getPhoneValidationError,
  normalizeKzPhone,
} from "../utils/phone.js";
import { validateName, validateOtpCode } from "../utils/input.js";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  throttleAction,
} from "../utils/security.js";

export default function ClientAuth({
  clients,
  onSaveClients,
  onLogin,
  onNotify,
  blockedByMaster,
}) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const normalizedPhone = normalizeKzPhone(phone);
  const existingClient = clients.find((client) => client.phone === normalizedPhone);

  if (blockedByMaster) {
    return (
      <section className="min-h-[calc(100svh-64px)] bg-gray-50 px-4 py-10 pb-28">
        <div className="mx-auto max-w-md rounded-[28px] bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-950">Вход недоступен</h1>
          <p className="mt-2 text-sm text-gray-500">
            Вы уже вошли как мастер. В Twins можно быть либо клиентом, либо мастером — не одновременно.
          </p>
          <a
            href="#master-profile"
            className="mt-5 inline-flex rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Перейти в кабинет мастера
          </a>
        </div>
      </section>
    );
  }

  const submitPhone = (event) => {
    event.preventDefault();
    const throttle = throttleAction("client:phone", 1000);
    if (!throttle.allowed) {
      onNotify?.("Подождите", throttle.message);
      return;
    }
    const limit = checkRateLimit("client:phone", { maxAttempts: 8 });
    if (!limit.allowed) {
      onNotify?.("Лимит запросов", limit.message);
      return;
    }
    const error = getPhoneValidationError(phone);
    if (error) {
      setPhoneError(error);
      recordFailedAttempt("client:phone");
      onNotify?.("Проверьте номер", error);
      return;
    }
    setPhoneError("");
    resetRateLimit("client:phone");
    setStep("code");
    onNotify?.("Код для MVP", "Введите фиксированный код 1111.");
  };

  const submitCode = (event) => {
    event.preventDefault();
    const throttle = throttleAction("client:code", 600);
    if (!throttle.allowed) {
      onNotify?.("Подождите", throttle.message);
      return;
    }
    const limit = checkRateLimit("client:code", { maxAttempts: 5, lockoutMs: 3 * 60 * 1000 });
    if (!limit.allowed) {
      onNotify?.("Слишком много попыток", limit.message);
      return;
    }
    const { value: safeCode, error } = validateOtpCode(code);
    setCode(safeCode);
    if (error) {
      setCodeError(error);
      recordFailedAttempt("client:code");
      return;
    }
    if (safeCode !== "1111") {
      setCodeError("Неверный код");
      recordFailedAttempt("client:code");
      onNotify?.("Неверный код", "Для разработки используется код 1111.");
      return;
    }
    setCodeError("");
    resetRateLimit("client:code");
    if (existingClient) {
      onLogin(existingClient);
      onNotify?.("С возвращением", `${existingClient.name}, вы вошли в профиль.`);
      return;
    }
    setStep("name");
  };

  const submitName = (event) => {
    event.preventDefault();
    const { value: safeName, error } = validateName(name);
    setName(safeName);
    if (error) {
      setNameError(error);
      onNotify?.("Проверьте имя", error);
      return;
    }
    setNameError("");
    const newClient = {
      id: Date.now(),
      phone: normalizedPhone,
      name: safeName,
    };
    onSaveClients([...clients, newClient]);
    onLogin(newClient);
    onNotify?.("Профиль клиента готов", "Вы вошли как клиент.");
  };

  return (
    <section className="min-h-[calc(100svh-64px)] bg-gray-50 px-4 py-8 pb-28 md:py-14 md:pb-14">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <a href="#top" className="mb-4 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
            ← На карту
          </a>
          <h1 className="text-2xl font-bold text-gray-950 md:text-4xl">Вход клиента</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Один аккаунт — одна роль. Если вы мастер, используйте кабинет мастера.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          {step === "phone" && (
            <form onSubmit={submitPhone} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">Номер телефона</span>
                <input
                  value={phone}
                  onChange={(event) => {
                    setPhone(formatKzPhone(event.target.value));
                    setPhoneError("");
                  }}
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={18}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${phoneError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-indigo-400"}`}
                  placeholder="+7 (707) 000-00-12"
                />
                {phoneError && <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>}
              </label>
              <button className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white">Получить код</button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={submitCode} className="space-y-4">
              <div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-700">
                Код отправлен на {normalizedPhone}
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">Код подтверждения</span>
                <input
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 4));
                    setCodeError("");
                  }}
                  inputMode="numeric"
                  maxLength={4}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${codeError ? "border-red-300" : "border-gray-200 focus:border-indigo-400"}`}
                  placeholder="1111"
                />
                {codeError && <p className="mt-1.5 text-xs text-red-500">{codeError}</p>}
              </label>
              <button className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white">Продолжить</button>
            </form>
          )}

          {step === "name" && (
            <form onSubmit={submitName} className="space-y-4">
              <div className="rounded-2xl bg-pink-50 p-4 text-sm text-pink-700">Номер новый. Как к вам обращаться?</div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">Имя</span>
                <input
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setNameError("");
                  }}
                  maxLength={60}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${nameError ? "border-red-300" : "border-gray-200 focus:border-indigo-400"}`}
                  placeholder="Например, Максим"
                />
                {nameError && <p className="mt-1.5 text-xs text-red-500">{nameError}</p>}
              </label>
              <button className="w-full rounded-2xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white">Войти</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
