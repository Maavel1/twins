export function getPhoneDigits(value = "") {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) return `7${digits.slice(1)}`;
  if (digits.startsWith("7")) return digits;
  if (digits.length > 0) return `7${digits}`;
  return "";
}

export function formatKzPhone(value) {
  const normalized = getPhoneDigits(value).slice(0, 11);
  const part1 = normalized.slice(1, 4);
  const part2 = normalized.slice(4, 7);
  const part3 = normalized.slice(7, 9);
  const part4 = normalized.slice(9, 11);

  if (!normalized) return "";
  let result = "+7";
  if (part1) result += ` (${part1}`;
  if (part1.length === 3) result += ")";
  if (part2) result += ` ${part2}`;
  if (part3) result += `-${part3}`;
  if (part4) result += `-${part4}`;
  return result;
}

export function normalizeKzPhone(value) {
  return formatKzPhone(value);
}

export function isValidKzPhone(value) {
  const digits = getPhoneDigits(value);
  if (digits.length !== 11) return false;
  if (!digits.startsWith("7")) return false;
  const operatorCode = digits.slice(1, 4);
  return /^[67]\d{2}$/.test(operatorCode);
}

export function getPhoneValidationError(value) {
  const digits = getPhoneDigits(value);
  if (!digits) return "Введите номер телефона";
  if (digits.length < 11) return "Введите полный номер: +7 (XXX) XXX-XX-XX";
  if (!digits.startsWith("7")) return "Номер должен начинаться с +7";
  const operatorCode = digits.slice(1, 4);
  if (!/^[67]\d{2}$/.test(operatorCode)) {
    return "Код оператора должен начинаться с 6 или 7 (например, 707, 747, 775)";
  }
  return "";
}

export function maskPhone(phone = "") {
  const digits = getPhoneDigits(phone);
  if (digits.length < 4) return phone;
  return `+7 (${digits.slice(1, 4)}) *** ** ${digits.slice(-2)}`;
}
