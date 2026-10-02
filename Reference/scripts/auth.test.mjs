import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mock, test } from "node:test";
import { isAxiosError } from "axios";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const compiled = new Map();
const token = (id = "alice", accessToken = "access-1") => ({
  userId: id, email: `${id}@example.com`, firstName: id, lastName: "Cook",
  roles: ["CHEF"], accessToken, refreshToken: `refresh-${accessToken}`,
  accessTokenExpiresAtUtc: "2099-01-01T00:00:00Z",
});

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

// Run real service modules with fresh state; only native storage, I/O and app effects are faked.
function setup(stored) {
  const storage = new Map(stored === undefined ? [] : [["auth.session", stored]]);
  const secureStore = {
    getItemAsync: mock.fn(async key => storage.get(key) ?? null),
    setItemAsync: mock.fn(async (key, value) => { storage.set(key, value); }),
    deleteItemAsync: mock.fn(async key => { storage.delete(key); }),
  };
  const post = mock.fn(async () => { throw new Error("Unexpected refresh"); });
  const logout = mock.fn(async () => {});
  const replace = mock.fn();
  const clearQueries = mock.fn();
  const clearNavigation = mock.fn();
  const dependencies = {
    "expo-secure-store": secureStore,
    "expo-device": {},
    "expo-constants": { default: {} },
    "react-native": { Platform: { OS: "android" } },
    "axios": { __esModule: true, isAxiosError, default: { create: () => ({ post }) } },
    "./auth.api": { logout },
    "expo-router": { router: { replace } },
    "@/lib/react-query": { queryClient: { clear: clearQueries } },
    "@/lib/pending-navigation": {
      clearPendingAuthenticatedHref: clearNavigation,
      consumePendingAuthenticatedHref: () => null,
    },
  };
  const modules = new Map();
  function load(file) {
    const path = resolve(root, file);
    if (modules.has(path)) return modules.get(path);
    if (!compiled.has(path)) {
      compiled.set(path, ts.transpileModule(readFileSync(path, "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        fileName: path,
      }).outputText);
    }
    const exports = {};
    modules.set(path, exports);
    const require = name => {
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      if (name.startsWith("@/")) return load(`${name.slice(2)}.ts`);
      if (name.startsWith(".")) return load(resolve(dirname(path), `${name}.ts`));
      throw new Error(`Unexpected dependency: ${name}`);
    };
    new Function("require", "exports", compiled.get(path))(require, exports);
    return exports;
  }
  const session = load("services/auth/auth.session.ts");
  const events = [];
  session.subscribeAuthSession(event => events.push(event));
  return {
    storage, secureStore, post, logout, replace, clearQueries, clearNavigation, events,
    ...session,
    ...load("services/auth/auth.refresh.ts"),
    ...load("services/auth/auth.lifecycle.ts"),
    ...load("services/auth/device-installation.ts"),
  };
}

test("installation ID shares concurrent work and retries failed reads and writes", async () => {
  const auth = setup();
  auth.secureStore.getItemAsync.mock.mockImplementationOnce(async () => { throw new Error("locked"); });
  const failed = auth.getDeviceInstallationId();
  assert.strictEqual(auth.getDeviceInstallationId(), failed);
  await assert.rejects(failed, /locked/);
  auth.secureStore.setItemAsync.mock.mockImplementationOnce(async () => { throw new Error("full"); });
  await assert.rejects(auth.getDeviceInstallationId(), /full/);
  const id = await auth.getDeviceInstallationId();
  assert.match(id, /^[0-9a-f-]{36}$/);
  assert.equal(await auth.getDeviceInstallationId(), id);
  assert.equal(auth.secureStore.getItemAsync.mock.callCount(), 3);
  assert.equal(auth.storage.get("auth.deviceInstallationId"), id);
});

test("valid stored session restores without a network call", async () => {
  const auth = setup(JSON.stringify(token()));
  const session = await auth.restoreSession();
  assert.equal(session.user.uuid, "alice");
  assert.equal(session.accessToken, "access-1");
  assert.equal(auth.post.mock.callCount(), 0);
});

test("expired stored session stays available while refresh is pending", async () => {
  const auth = setup(JSON.stringify({ ...token(), accessTokenExpiresAtUtc: "2000-01-01T00:00:00Z" }));
  const response = deferred();
  auth.post.mock.mockImplementation(() => response.promise);
  assert.equal((await auth.restoreSession()).user.uuid, "alice");
  const refresh = auth.requestNewToken();
  response.resolve({ data: token("alice", "access-2") });
  await refresh;
  assert.equal(auth.post.mock.callCount(), 1);
  assert.equal(await auth.getAccessToken(), "access-2");
});

test("corrupt storage is removed; transient read failure can be retried", async () => {
  const auth = setup("not json");
  auth.secureStore.getItemAsync.mock.mockImplementationOnce(async () => { throw new Error("locked"); });
  await assert.rejects(auth.restoreSession(), /locked/);
  assert.equal(await auth.restoreSession(), null);
  assert.equal(auth.storage.has("auth.session"), false);
  assert.equal(auth.events.at(-1).reason, "cleared");
});

test("concurrent refresh calls rotate once and preserve unchanged user identity", async () => {
  const auth = setup();
  await auth.establishAuthSession(token(), 0);
  const user = (await auth.getAuthSession()).user;
  const response = deferred();
  auth.post.mock.mockImplementation(() => response.promise);
  const first = auth.requestNewToken();
  assert.strictEqual(auth.requestNewToken(), first);
  response.resolve({ data: token("alice", "access-2") });
  await first;
  assert.equal(auth.post.mock.callCount(), 1);
  assert.equal(await auth.getAccessToken(), "access-2");
  assert.strictEqual((await auth.getAuthSession()).user, user);
  assert.equal(JSON.parse(auth.storage.get("auth.session")).refreshToken, "refresh-access-2");
});

test("offline refresh preserves credentials and allows another attempt", async () => {
  const auth = setup();
  await auth.establishAuthSession(token(), 0);
  auth.post.mock.mockImplementationOnce(async () => { throw new Error("offline"); });
  await assert.rejects(auth.requestNewToken(), /offline/);
  assert.equal(await auth.getAccessToken(), "access-1");
  auth.post.mock.mockImplementation(async () => ({ data: token("alice", "access-2") }));
  await auth.requestNewToken();
  assert.equal(await auth.getAccessToken(), "access-2");
});

test("rejected refresh token clears credentials and cached user data", async () => {
  const auth = setup();
  await auth.establishAuthSession(token(), 0);
  auth.post.mock.mockImplementation(async () => {
    throw { isAxiosError: true, response: { status: 401, data: { code: "REFRESH_TOKEN_INVALID" } } };
  });
  await assert.rejects(auth.requestNewToken());
  assert.equal(await auth.getAuthSession(), null);
  assert.equal(auth.storage.has("auth.session"), false);
  assert.equal(auth.clearQueries.mock.callCount(), 2);
  assert.equal(auth.clearNavigation.mock.callCount(), 1);
});

test("failed rotated-token write discards the consumed refresh token", async () => {
  const auth = setup();
  await auth.establishAuthSession(token(), 0);
  auth.post.mock.mockImplementation(async () => ({ data: token("alice", "access-2") }));
  auth.secureStore.setItemAsync.mock.mockImplementationOnce(async () => { throw new Error("full"); });
  await assert.rejects(auth.requestNewToken(), /full/);
  assert.equal(await auth.getAuthSession(), null);
  assert.equal(auth.storage.has("auth.session"), false);
});

test("offline logout succeeds locally and shares duplicate logout calls", async () => {
  const auth = setup();
  await auth.establishAuthSession(token(), 0);
  const response = deferred();
  auth.logout.mock.mockImplementation(() => response.promise);
  const first = auth.signOut();
  assert.strictEqual(auth.signOut(), first);
  response.reject(new Error("offline"));
  await first;
  assert.equal(auth.logout.mock.callCount(), 1);
  assert.equal(await auth.getAuthSession(), null);
  assert.equal(auth.storage.has("auth.session"), false);
});

test("failed local logout remains visible as a failure and can be retried", async () => {
  const auth = setup();
  await auth.establishAuthSession(token(), 0);
  auth.logout.mock.mockImplementation(async () => { throw new Error("offline"); });
  auth.secureStore.deleteItemAsync.mock.mockImplementationOnce(async () => { throw new Error("storage locked"); });
  await assert.rejects(auth.signOut(), /storage locked/);
  assert.equal(await auth.getAccessToken(), "access-1");
  assert.equal(auth.events.some(event => event.reason === "cleared"), false);
  await auth.signOut();
  assert.equal(await auth.getAuthSession(), null);
});

test("late refresh cannot restore a logged-out session", async () => {
  const auth = setup();
  await auth.establishAuthSession(token(), 0);
  const response = deferred();
  const started = deferred();
  auth.post.mock.mockImplementation(() => { started.resolve(); return response.promise; });
  const refresh = auth.requestNewToken();
  const rejected = assert.rejects(refresh, { name: "SessionChangedError" });
  await started.promise;
  await auth.clearAuthSession();
  response.resolve({ data: token("alice", "late-access") });
  await rejected;
  assert.equal(await auth.getAuthSession(), null);
  assert.equal(auth.storage.has("auth.session"), false);
});

test("late logout and refresh rejection cannot clear a newer login", async () => {
  const auth = setup();
  await auth.establishAuthSession(token(), 0);
  const response = deferred();
  const started = deferred();
  auth.post.mock.mockImplementation(() => { started.resolve(); return response.promise; });
  auth.logout.mock.mockImplementation(() => response.promise);
  const refresh = auth.requestNewToken();
  const rejected = assert.rejects(refresh);
  const logout = auth.signOut();
  await started.promise;
  await auth.establishAuthSession(token("bob", "bob-access"), auth.getSessionVersion());
  response.reject({ isAxiosError: true, response: { status: 401, data: { code: "REFRESH_TOKEN_INVALID" } } });
  await Promise.all([logout, rejected]);
  assert.equal((await auth.getAuthSession()).user.uuid, "bob");
  assert.equal(JSON.parse(auth.storage.get("auth.session")).accessToken, "bob-access");
});

test("logout waits for an in-progress storage write before deleting credentials", async () => {
  const auth = setup();
  const started = deferred();
  const release = deferred();
  auth.secureStore.setItemAsync.mock.mockImplementationOnce(async (key, value) => {
    started.resolve();
    await release.promise;
    auth.storage.set(key, value);
  });
  const login = auth.establishAuthSession(token(), 0);
  const rejected = assert.rejects(login, { name: "SessionChangedError" });
  await started.promise;
  const clear = auth.clearAuthSession();
  assert.equal(await auth.getAccessToken(), null);
  assert.equal(auth.secureStore.deleteItemAsync.mock.callCount(), 0);
  release.resolve();
  await Promise.all([clear, rejected]);
  assert.equal(auth.storage.has("auth.session"), false);
  assert.equal(await auth.getAuthSession(), null);
});
