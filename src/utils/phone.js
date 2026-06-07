export function formatKzPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const normalized = digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
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

export function maskPhone(phone = "") {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) *** ** ${digits.slice(-2)}`;
}
