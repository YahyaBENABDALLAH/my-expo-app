import assert from 'node:assert/strict';
import test from 'node:test';
import { createSourceLoader } from '../helpers/load-source.mjs';

const { normalizeOtpCode } = createSourceLoader()('components/ui/otp-bottom-sheet/otp-code.ts');

test('OTP input accepts pasted separators, caps length and preserves leading zeros', () => {
  assert.equal(normalizeOtpCode('00 12-34'), '001234');
  assert.equal(normalizeOtpCode('123456789'), '123456');
  assert.equal(normalizeOtpCode('abc'), '');
  assert.equal(normalizeOtpCode(''), '');
  assert.equal(normalizeOtpCode('12345'), '12345');
});

test('OTP input normalizes supported numeric scripts for verification callbacks', () => {
  assert.equal(normalizeOtpCode('٠١٢٣٤٥'), '012345');
  assert.equal(normalizeOtpCode('۰۱۲۳۴۵'), '012345');
  assert.equal(normalizeOtpCode('０１２３４５'), '012345');
  assert.equal(normalizeOtpCode('1٢۳４5٦'), '123456');
});
