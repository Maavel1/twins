import { sanitizeText } from "./security.js";

const NAME_PATTERN = /^[a-zA-Zа-яА-ЯёЁіІңҢғҒүҮұҰқҚөӨһҺ\s'.-]+$/;
const SEARCH_PATTERN = /^[a-zA-Zа-яА-ЯёЁіІңҢғҒүҮұҰқҚөӨһҺ0-9\s.,'-]+$/;
const CODE_PATTERN = /^\d{4}$/;
const TELEGRAM_PATTERN = /^@?[a-zA-Z0-9_]{3,32}$/;

export function validateName(value) {
  const name = sanitizeText(value, { maxLength: 60 });
  if (!name) return { value: "", error: "Введите имя" };
  if (name.length < 2) return { value: name, error: "Имя слишком короткое" };
  if (!NAME_PATTERN.test(name)) {
    return { value: name, error: "Имя содержит недопустимые символы" };
  }
  return { value: name, error: "" };
}

export function validateSearch(value) {
  const query = sanitizeText(value, { maxLength: 80 });
  if (!query) return { value: "", error: "" };
  if (!SEARCH_PATTERN.test(query)) {
    return { value: query, error: "Недопустимые символы в поиске" };
  }
  return { value: query, error: "" };
}

export function validateComment(value) {
  const comment = sanitizeText(value, { maxLength: 500, allowNewlines: true });
  if (!comment) return { value: "", error: "" };
  if (comment.length < 3) {
    return { value: comment, error: "Комментарий слишком короткий" };
  }
  return { value: comment, error: "" };
}

export function validateOtpCode(value) {
  const code = sanitizeText(value, { maxLength: 4 }).replace(/\D/g, "");
  if (!CODE_PATTERN.test(code)) {
    return { value: code, error: "Код — 4 цифры" };
  }
  return { value: code, error: "" };
}

export function validateAbout(value) {
  const about = sanitizeText(value, { maxLength: 1000, allowNewlines: true });
  if (about.length > 0 && about.length < 10) {
    return { value: about, error: "Описание слишком короткое (мин. 10 символов)" };
  }
  return { value: about, error: "" };
}

export function validateTelegram(value) {
  const handle = sanitizeText(value, { maxLength: 33 });
  if (!handle) return { value: "", error: "" };
  if (!TELEGRAM_PATTERN.test(handle)) {
    return { value: handle, error: "Некорректный Telegram (например, @username)" };
  }
  return { value: handle, error: "" };
}

export function validateWhatsapp(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return { value: "", error: "" };
  if (digits.length < 11) {
    return { value: digits, error: "WhatsApp — полный номер 11 цифр" };
  }
  return { value: digits, error: "" };
}
