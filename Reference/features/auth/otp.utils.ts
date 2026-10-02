export const OTP_LENGTH = 6;

export function normalizeOtp(value: string) {
  return value
    .replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) % 16))
    .replace(/\D/g, "")
    .slice(0, OTP_LENGTH);
}

export function updateOtpDigits(
  current: string[],
  index: number,
  value: string,
) {
  const digits = normalizeOtp(value);
  const next = [...current];
  const start = digits.length === OTP_LENGTH ? 0 : index;
  if (!digits) next[index] = "";
  else
    [...digits].forEach((digit, offset) => {
      if (start + offset < OTP_LENGTH) next[start + offset] = digit;
    });
  return {
    digits: next,
    focus: Math.min(start + digits.length, OTP_LENGTH - 1),
  };
}
