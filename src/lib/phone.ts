export function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatPhoneInput(value: string) {
  let digits = phoneDigits(value);
  if (digits.length === 0) return "";

  if (digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  } else if (digits.startsWith("9")) {
    digits = "7" + digits;
  } else if (!digits.startsWith("7")) {
    digits = "7" + digits;
  }

  digits = digits.slice(0, 11);
  const local = digits.slice(1);

  if (local.length === 0) return "+7";

  let out = `+7 ${local.slice(0, 3)}`;
  if (local.length > 3) out += ` ${local.slice(3, 6)}`;
  if (local.length > 6) out += `-${local.slice(6, 8)}`;
  if (local.length > 8) out += `-${local.slice(8, 10)}`;
  return out;
}

export function isValidRuPhone(value: string) {
  const digits = phoneDigits(value);
  return digits.length === 11 && digits.startsWith("7");
}

export function normalizePhone(value: string) {
  return formatPhoneInput(value);
}
