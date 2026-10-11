export const OTP_LENGTH = 6;

/** Accept pasted separators and the numeric scripts used by our supported locales. */
export function normalizeOtpCode(value: string) {
  return value
    .replace(/[\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]/g, (digit) => {
      const point = digit.charCodeAt(0);
      const zero = point >= 0xff10 ? 0xff10 : point >= 0x06f0 ? 0x06f0 : 0x0660;
      return String(point - zero);
    })
    .replace(/[^0-9]/g, '')
    .slice(0, OTP_LENGTH);
}
