/*===== Persian and Arabic Contact Normalization =====*/

export function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - "۰".charCodeAt(0)))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - "٠".charCodeAt(0)));
}

/** Removes presentation separators and converts the Iranian +98 prefix to its local 0 form. */
export function normalizeMobile(value: string) {
  const digits = normalizeDigits(value).replace(/[\s-]/g, "");
  return digits.startsWith("+98") ? `0${digits.slice(3)}` : digits;
}
