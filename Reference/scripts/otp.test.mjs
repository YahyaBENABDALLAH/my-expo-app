import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

function load(path, dependencies = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  new Function("require", "exports", code)(name => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  }, exports);
  return exports;
}
const utils = load("../features/auth/otp.utils.ts");
const blank = () => Array(6).fill("");

test("OTP normalizes Latin, Arabic and Persian numbers without allowing other characters", () => {
  assert.equal(utils.normalizeOtp("١٢٣٤٥٦"), "123456");
  assert.equal(utils.normalizeOtp("۱۲۳۴۵۶"), "123456");
  assert.equal(utils.normalizeOtp("12 34-56x78"), "123456");
});
test("typing advances, clearing stays put, and full-code paste replaces all cells", () => {
  assert.deepEqual(utils.updateOtpDigits(blank(), 0, "4"), { digits: ["4", "", "", "", "", ""], focus: 1 });
  assert.deepEqual(utils.updateOtpDigits(["1", "2", "3", "4", "5", "6"], 2, ""), { digits: ["1", "2", "", "4", "5", "6"], focus: 2 });
  assert.deepEqual(utils.updateOtpDigits(blank(), 4, "123456"), { digits: [..."123456"], focus: 5 });
  const current = blank();
  assert.deepEqual(utils.updateOtpDigits(current, 4, "123"), { digits: ["", "", "", "", "1", "2"], focus: 5 });
  assert.deepEqual(current, blank());
});

// Exercise the real sheet's event handlers with native rendering replaced by a tree.
function sheet(props) {
  const hooks = [];
  let cursor = 0;
  const node = (type, props) => ({ type, props });
  const state = initial => {
    const index = cursor++;
    if (!(index in hooks)) hooks[index] = initial;
    return [hooks[index], value => { hooks[index] = value; }];
  };
  const { OtpSheet } = load("../features/auth/components/otp-sheet.tsx", {
    "react/jsx-runtime": { jsx: node, jsxs: node },
    react: { useState: state, useRef: value => state({ current: value })[0], useEffect: () => {} },
    "@/components/Universal/bottom-sheet": { BottomSheet: "Sheet" },
    "@/components/Universal/button": { Button: "Button" },
    "@/components/Universal/layout": { Host: "Host", RNHostView: "Bridge" },
    "@/components/Universal/text": { Text: "Text" },
    "@/constants/theme.tokens": { space: value => value * 4 },
    "@/context/theme.context": { useTheme: () => ({ colors: {} }) },
    "@/features/auth/components/otp-input": { OtpInput: "Input" },
    "@/features/auth/otp.utils": utils,
    "@/services/auth/auth.service": { getAuthErrorMessage: error => error.message },
    "react-i18next": { useTranslation: () => ({ t: key => key }) },
    "react-native": { Keyboard: { dismiss() {} }, ScrollView: "Scroll", View: "View", useWindowDimensions: () => ({ height: 800 }) },
    "react-native-reanimated": { default: { View: "Animated" }, useReducedMotion: () => true },
  });
  function find(type) {
    cursor = 0;
    function visit(node) {
      if (!node) return;
      if (node.type === type) return node.props;
      for (const child of [node.props?.children].flat()) {
        const result = visit(child);
        if (result) return result;
      }
    }
    return visit(OtpSheet({ title: "Verify", description: "Code", onDismiss() {}, ...props }));
  }
  return find;
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test("sixth digit submits automatically once, including repeated native change events", async () => {
  const calls = [];
  const find = sheet({ onSubmit: async code => { calls.push(code); } });
  find("Input").onChange(["1", "2", "3", "4", "5", ""]);
  assert.equal(calls.length, 0);
  find("Input").onChange([..."123456"]);
  find("Input").onChange([..."123456"]);
  await tick();
  find("Input").onChange([..."123456"]);
  assert.deepEqual(calls, ["123456"]);
});
test("failed verification remains retryable with the same code", async () => {
  let calls = 0;
  const find = sheet({ onSubmit: async () => { calls++; throw new Error("Wrong code"); } });
  find("Input").onChange([..."123456"]);
  await tick();
  assert.equal(find("Input").invalid, true);
  find("Button").onPress();
  await tick();
  assert.equal(calls, 2);
});
test("dismissing an in-flight sheet suppresses success navigation", async () => {
  let resolve, success = 0;
  const find = sheet({ onSubmit: () => new Promise(done => { resolve = done; }), onSuccess: () => success++ });
  find("Input").onChange([..."123456"]);
  find("Sheet").onDismiss();
  resolve();
  await tick();
  assert.equal(success, 0);
});
