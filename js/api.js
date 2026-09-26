(() => {
"use strict";

const TipaxAPI = {
initialized: false,
storageKey: "tipax-api-config",
cacheKey: "tipax-api-cache",
historyKey: "tipax-api-history",
defaults: {
enabled: false,
baseUrl: "",
endpoint: "",
method: "GET",
authType: "none",
token: "",
apiKey: "",
apiKeyHeader: "X-API-Key",
username: "",
password: "",
timeout: 15000,
autoSync: false,
syncInterval: 15,
statusParam: "status",
dateFromParam: "dateFrom",
dateToParam: "dateTo",
pageParam: "page",
limitParam: "limit",
limit: 1000,
headers: {},
params: {}
},
initializedForm: false,
syncTimer: null,
requestController: null,

init() {
  if (this.initialized) return;
  this.initialized = true;
  this.bindEvents();
  this.loadConfigToForm();
  this.renderConnectionState();
  this.renderHistory();
  this.renderCacheStats();
  this.setupAutoSync();
},

bindEvents() {
  document.addEventListener("submit", e => {
    const form = e.target.closest("[data-api-form],#apiForm");
    if (!form) return;
    e.preventDefault();
    this.saveFromForm(form);
  });

  document.addEventListener("click", e => {
    const button = e.target.closest("[data-api-action]");
    if (!button) return;

    e.preventDefault();

    const action = button.dataset.apiAction;

    if (action === "save") this.saveFromPage();
    if (action === "test") this.testConnection();
    if (action === "sync") this.sync();
    if (action === "cancel") this.cancelRequest();
    if (action === "clear-cache") this.clearCache();
    if (action === "clear-history") this.clearHistory();
    if (action === "reset") this.resetConfig();
    if (action === "toggle-token") {
      this.toggleSecret(button.dataset.target);
    }
  });

  document.addEventListener("change", e => {
    const input = e.target.closest("[data-api-auto-sync]");
    if (!input) return;

    const config = this.getConfig();
    config.autoSync = Boolean(input.checked);
    this.saveConfig(config, false);
    this.setupAutoSync();
  });

  document.addEventListener("input", e => {
    if (!e.target.matches("[data-api-json]")) return;
    e.target.classList.remove("is-invalid");
  });

  window.addEventListener("storage", e => {
    if (
      e.key === this.storageKey ||
      e.key === this.cacheKey ||
      e.key === this.historyKey
    ) {
      this.loadConfigToForm();
      this.renderConnectionState();
      this.renderHistory();
      this.renderCacheStats();
    }
  });
},

getConfig() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(this.storageKey) || "null"
    );

    return {
      ...this.defaults,
      ...(stored && typeof stored === "object" ? stored : {})
    };
  } catch {
    return { ...this.defaults };
  }
},

saveConfig(config, notify = true) {
  const safe = {
    ...this.defaults,
    ...config,
    timeout: Math.max(
      1000,
      Number(config.timeout) || this.defaults.timeout
    ),
    syncInterval: Math.max(
      1,
      Number(config.syncInterval) || this.defaults.syncInterval
    ),
    limit: Math.max(
      1,
      Number(config.limit) || this.defaults.limit
    )
  };

  try {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(safe)
    );

    if (notify) {
      this.notify(
        "تنظیمات API با موفقیت ذخیره شد.",
        "success"
      );
    }

    document.dispatchEvent(
      new CustomEvent("tipax:api-config-changed", {
        detail: { config: safe }
      })
    );

    this.setupAutoSync();
    this.renderConnectionState();

    return safe;
  } catch {
    this.notify(
      "ذخیره تنظیمات API انجام نشد.",
      "error"
    );
    return null;
  }
},

saveFromPage() {
  const form =
    document.querySelector("[data-api-form],#apiForm");

  if (!form) {
    this.notify(
      "فرم تنظیمات API پیدا نشد.",
      "error"
    );
    return;
  }

  this.saveFromForm(form);
},

saveFromForm(form) {
  const config = this.readForm(form);

  if (!this.validateConfig(config)) return;

  this.saveConfig(config);
  this.loadConfigToForm();
},

readForm(form) {
  const value = name => {
    const input =
      form.querySelector(
        `[name="${name}"],[data-api-field="${name}"]`
      );

    return input ? input.value : "";
  };

  const checked = name => {
    const input =
      form.querySelector(
        `[name="${name}"],[data-api-field="${name}"]`
      );

    return Boolean(input?.checked);
  };

  const jsonValue = name => {
    const raw = value(name).trim();
    if (!raw) return {};

    try {
      const parsed = JSON.parse(raw);

      if (
        parsed === null ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        throw new Error();
      }

      return parsed;
    } catch {
      throw new Error(
        `مقدار ${name} باید JSON معتبر باشد.`
      );
    }
  };

  let headers = {};
  let params = {};

  try {
    headers = jsonValue("headers");
    params = jsonValue("params");
  } catch (error) {
    this.notify(error.message, "error");
  }

  return {
    ...this.getConfig(),
    enabled: checked("enabled"),
    baseUrl: value("baseUrl").trim(),
    endpoint: value("endpoint").trim(),
    method: (
      value("method") || "GET"
    ).toUpperCase(),
    authType: value("authType") || "none",
    token: value("token"),
    apiKey: value("apiKey"),
    apiKeyHeader:
      value("apiKeyHeader") || "X-API-Key",
    username: value("username"),
    password: value("password"),
    timeout: Number(value("timeout")) || 15000,
    autoSync: checked("autoSync"),
    syncInterval:
      Number(value("syncInterval")) || 15,
    statusParam:
      value("statusParam") || "status",
    dateFromParam:
      value("dateFromParam") || "dateFrom",
    dateToParam:
      value("dateToParam") || "dateTo",
    pageParam:
      value("pageParam") || "page",
    limitParam:
      value("limitParam") || "limit",
    limit:
      Number(value("limit")) || 1000,
    headers,
    params
  };
},

validateConfig(config) {
  if (!config.baseUrl && config.enabled) {
    this.notify(
      "آدرس پایه API را وارد کنید.",
      "error"
    );
    return false;
  }

  if (
    config.baseUrl &&
    !/^https?:\/\//i.test(config.baseUrl)
  ) {
    this.notify(
      "آدرس API باید با http:// یا https:// شروع شود.",
      "error"
    );
    return false;
  }

  const methods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ];

  if (!methods.includes(config.method)) {
    this.notify(
      "متد درخواست API معتبر نیست.",
      "error"
    );
    return false;
  }

  const authTypes = [
    "none",
    "bearer",
    "api-key",
    "basic"
  ];

  if (!authTypes.includes(config.authType)) {
    this.notify(
      "نوع احراز هویت API معتبر نیست.",
      "error"
    );
    return false;
  }

  if (config.authType === "bearer" && !config.token) {
    this.notify(
      "توکن Bearer را وارد کنید.",
      "error"
    );
    return false;
  }

  if (
    config.authType === "api-key" &&
    (!config.apiKey || !config.apiKeyHeader)
  ) {
    this.notify(
      "کلید API و نام Header را وارد کنید.",
      "error"
    );
    return false;
  }

  if (
    config.authType === "basic" &&
    (!config.username || !config.password)
  ) {
    this.notify(
      "نام کاربری و رمز عبور API را وارد کنید.",
      "error"
    );
    return false;
  }

  return true;
},

loadConfigToForm() {
  const config = this.getConfig();

  const forms = document.querySelectorAll(
    "[data-api-form],#apiForm"
  );

  forms.forEach(form => {
    this.setField(form, "baseUrl", config.baseUrl);
    this.setField(form, "endpoint", config.endpoint);
    this.setField(form, "method", config.method);
    this.setField(form, "authType", config.authType);
    this.setField(form, "token", config.token);
    this.setField(form, "apiKey", config.apiKey);
    this.setField(
      form,
      "apiKeyHeader",
      config.apiKeyHeader
    );
    this.setField(form, "username", config.username);
    this.setField(form, "password", config.password);
    this.setField(form, "timeout", config.timeout);
    this.setField(
      form,
      "syncInterval",
      config.syncInterval
    );
    this.setField(
      form,
      "statusParam",
      config.statusParam
    );
    this.setField(
      form,
      "dateFromParam",
      config.dateFromParam
    );
    this.setField(
      form,
      "dateToParam",
      config.dateToParam
    );
    this.setField(
      form,
      "pageParam",
      config.pageParam
    );
    this.setField(
      form,
      "limitParam",
      config.limitParam
    );
    this.setField(form, "limit", config.limit);

    this.setChecked(
      form,
      "enabled",
      config.enabled
    );

    this.setChecked(
      form,
      "autoSync",
      config.autoSync
    );

    this.setField(
      form,
      "headers",
      JSON.stringify(
        config.headers || {},
        null,
        2
      )
    );

    this.setField(
      form,
      "params",
      JSON.stringify(
        config.params || {},
        null,
        2
      )
    );
  });

  this.updateAuthFields(config.authType);
},

setField(form, name, value) {
  const input = form.querySelector(
    `[name="${name}"],[data-api-field="${name}"]`
  );

  if (input && !input.matches("[type='checkbox']")) {
    input.value = value ?? "";
  }
},

setChecked(form, name, checked) {
  const input = form.querySelector(
    `[name="${name}"],[data-api-field="${name}"]`
  );

  if (input?.type === "checkbox") {
    input.checked = Boolean(checked);
  }
},

updateAuthFields(type) {
  document
    .querySelectorAll("[data-api-auth]")
    .forEach(section => {
      const allowed =
        section.dataset.apiAuth === type;

      section.hidden = !allowed;
      section.classList.toggle(
        "is-active",
        allowed
      );
    });

  document
    .querySelectorAll("[data-api-auth-type]")
    .forEach(select => {
      select.value = type;
    });
},

buildUrl(config, options = {}) {
  const base =
    config.baseUrl.replace(/\/+$/, "");

  const endpoint =
    String(config.endpoint || "")
      .replace(/^\/+/, "");

  let url =
    endpoint
      ? `${base}/${endpoint}`
      : base;

  const params = {
    ...(config.params || {}),
    ...(options.params || {})
  };

  const hasQuery =
    Object.keys(params).length > 0;

  if (hasQuery) {
    const search = new URLSearchParams();

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          String(value) !== ""
        ) {
          search.set(
            key,
            String(value)
          );
        }
      }
    );

    const query =
      search.toString();

    if (query) {
      url +=
        `${url.includes("?") ? "&" : "?"}${query}`;
    }
  }

  return url;
},

buildHeaders(config, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(config.headers || {}),
    ...(options.headers || {})
  };

  if (
    config.method !== "GET" &&
    config.method !== "HEAD" &&
    !headers["Content-Type"] &&
    !headers["content-type"]
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  if (config.authType === "bearer") {
    headers.Authorization =
      `Bearer ${config.token}`;
  }

  if (config.authType === "api-key") {
    headers[config.apiKeyHeader] =
      config.apiKey;
  }

  if (config.authType === "basic") {
    headers.Authorization =
      `Basic ${btoa(
        `${config.username}:${config.password}`
      )}`;
  }

  return headers;
},

async request(options = {}) {
  const config = this.getConfig();

  if (!config.baseUrl) {
    throw new Error(
      "آدرس API تنظیم نشده است."
    );
  }

  const method =
    (
      options.method ||
      config.method ||
      "GET"
    ).toUpperCase();

  const url =
    this.buildUrl(
      {
        ...config,
        method
      },
      options
    );

  const headers =
    this.buildHeaders(
      {
        ...config,
        method
      },
      options
    );

  const controller =
    new AbortController();

  this.requestController =
    controller;

  const timeout =
    setTimeout(
      () => controller.abort(),
      Number(
        options.timeout ||
          config.timeout
      )
    );

  const startedAt =
    performance.now();

  try {
    const response =
      await fetch(
        url,
        {
          method,
          headers,
          signal:
            controller.signal,
          credentials:
            options.credentials ||
            "omit",
          body:
            method === "GET" ||
            method === "HEAD"
              ? undefined
              : this.prepareBody(
                  options.body
                )
        }
      );

    const elapsed =
      Math.round(
        performance.now() -
          startedAt
      );

    const data =
      await this.parseResponse(
        response
      );

    if (!response.ok) {
      const error =
        new Error(
          this.extractErrorMessage(
            data,
            response.status
          )
        );

      error.status =
        response.status;

      error.data = data;
      error.url = url;

      throw error;
    }

    return {
      ok: true,
      status:
        response.status,
      data,
      elapsed,
      url
    };
  } catch (error) {
    if (
      error?.name ===
      "AbortError"
    ) {
      throw new Error(
        "درخواست API لغو شد یا زمان پاسخ‌گویی به پایان رسید."
      );
    }

    if (
      error instanceof TypeError
    ) {
      throw new Error(
        "ارتباط با API برقرار نشد. آدرس، اینترنت یا CORS را بررسی کنید."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
    this.requestController =
      null;
  }
},

prepareBody(body) {
  if (
    body === undefined ||
    body === null
  ) {
    return undefined;
  }

  if (
    typeof body === "string"
  ) {
    return body;
  }

  return JSON.stringify(body);
},

async parseResponse(response) {
  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    return response.json();
  }

  const text =
    await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
},

extractErrorMessage(data, status) {
  if (typeof data === "string") {
    return (
      data ||
      `خطای API با کد ${status}`
    );
  }

  if (data && typeof data === "object") {
    return (
      data.message ||
      data.error ||
      data.detail ||
      data.title ||
      `خطای API با کد ${status}`
    );
  }

  return `خطای API با کد ${status}`;
},

async testConnection() {
  const form =
    document.querySelector(
      "[data-api-form],#apiForm"
    );

  if (form) {
    const config =
      this.readForm(form);

    if (!this.validateConfig(config)) {
      return;
    }

    this.saveConfig(
      config,
      false
    );
  }

  const config =
    this.getConfig();

  if (!config.baseUrl) {
    this.notify(
      "ابتدا آدرس API را وارد کنید.",
      "error"
    );
    return;
  }

  this.setBusy(
    true,
    "در حال تست اتصال..."
  );

  try {
    const result =
      await this.request({
        method:
          config.method === "POST"
            ? "GET"
            : config.method
      });

    this.addHistory({
      type: "test",
      ok: true,
      status: result.status,
      elapsed: result.elapsed,
      message:
        "اتصال با موفقیت برقرار شد."
    });

    this.notify(
      `اتصال موفق بود — ${result.status} — ${result.elapsed}ms`,
      "success"
    );

    this.setConnectionState(
      "connected",
      `متصل • ${result.status}`
    );

    return result;
  } catch (error) {
    this.addHistory({
      type: "test",
      ok: false,
      status: error.status || 0,
      elapsed: 0,
      message: error.message
    });

    this.notify(
      error.message ||
        "تست اتصال ناموفق بود.",
      "error"
    );

    this.setConnectionState(
      "error",
      "اتصال ناموفق"
    );

    return null;
  } finally {
    this.setBusy(false);
  }
},

async sync(options = {}) {
  const config =
    this.getConfig();

  if (!config.baseUrl) {
    this.notify(
      "ابتدا API را تنظیم کنید.",
      "error"
    );
    return null;
  }

  if (
    this.requestController
  ) {
    this.notify(
      "یک درخواست دیگر در حال اجراست.",
      "info"
    );
    return null;
  }

  this.setBusy(
    true,
    "در حال دریافت اطلاعات..."
  );

  const params = {
    ...(options.params || {})
  };

  if (
    config.statusParam &&
    options.status
  ) {
    params[config.statusParam] =
      options.status;
  }

  if (
    config.dateFromParam &&
    options.dateFrom
  ) {
    params[config.dateFromParam] =
      options.dateFrom;
  }

  if (
    config.dateToParam &&
    options.dateTo
  ) {
    params[config.dateToParam] =
      options.dateTo;
  }

  if (
    config.pageParam &&
    options.page
  ) {
    params[config.pageParam] =
      options.page;
  }

  if (
    config.limitParam &&
    config.limit
  ) {
    params[config.limitParam] =
      config.limit;
  }

  try {
    const result =
      await this.request({
        method:
          options.method ||
          config.method ||
          "GET",
        params,
        body:
          options.body
      });

    const normalized =
      this.normalizeApiData(
        result.data
      );

    this.saveCache(
      normalized,
      {
        status:
          result.status,
        elapsed:
          result.elapsed,
        url:
          result.url
      }
    );

    this.addHistory({
      type: "sync",
      ok: true,
      status: result.status,
      elapsed: result.elapsed,
      count:
        normalized.length,
      message:
        `${normalized.length} رکورد دریافت شد.`
    });

    this.notify(
      `${this.numberFormat(
        normalized.length
      )} رکورد با موفقیت همگام شد.`,
      "success"
    );

    this.setConnectionState(
      "connected",
      `همگام‌سازی موفق • ${result.status}`
    );

    document.dispatchEvent(
      new CustomEvent(
        "tipax:api-synced",
        {
          detail: {
            data:
              result.data,
            rows:
              normalized,
            meta: {
              status:
                result.status,
              elapsed:
                result.elapsed,
              url:
                result.url
            }
          }
        }
      )
    );

    this.renderCacheStats();

    return {
      ...result,
      rows: normalized
    };
  } catch (error) {
    this.addHistory({
      type: "sync",
      ok: false,
      status:
        error.status || 0,
      elapsed: 0,
      count: 0,
      message:
        error.message
    });

    this.notify(
      error.message ||
        "همگام‌سازی ناموفق بود.",
      "error"
    );

    this.setConnectionState(
      "error",
      "همگام‌سازی ناموفق"
    );

    return null;
  } finally {
    this.setBusy(false);
  }
},

normalizeApiData(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    data &&
    typeof data === "object"
  ) {
    const candidates = [
      "data",
      "items",
      "results",
      "shipments",
      "records",
      "rows"
    ];

    for (const key of candidates) {
      if (
        Array.isArray(data[key])
      ) {
        return data[key];
      }
    }

    return [data];
  }

  return [];
},

saveCache(rows, meta = {}) {
  try {
    const payload = {
      savedAt:
        new Date().toISOString(),
      rows:
        Array.isArray(rows)
          ? rows
          : [],
      meta
    };

    localStorage.setItem(
      this.cacheKey,
      JSON.stringify(payload)
    );
  } catch {
    this.notify(
      "ذخیره موقت پاسخ API انجام نشد.",
      "error"
    );
  }
},

readCache() {
  try {
    const data =
      JSON.parse(
        localStorage.getItem(
          this.cacheKey
        ) || "null"
      );

    return data &&
      typeof data === "object"
      ? data
      : {
          savedAt: null,
          rows: [],
          meta: {}
        };
  } catch {
    return {
      savedAt: null,
      rows: [],
      meta: {}
    };
  }
},

clearCache() {
  localStorage.removeItem(
    this.cacheKey
  );

  this.renderCacheStats();

  document.dispatchEvent(
    new CustomEvent(
      "tipax:api-cache-cleared"
    )
  );

  this.notify(
    "کش اطلاعات API پاک شد.",
    "success"
  );
},

renderCacheStats() {
  const cache =
    this.readCache();

  const count =
    Array.isArray(cache.rows)
      ? cache.rows.length
      : 0;

  const lastSync =
    cache.savedAt
      ? new Date(
          cache.savedAt
        ).toLocaleString(
          "fa-IR"
        )
      : "هنوز انجام نشده";

  document
    .querySelectorAll(
      "[data-api-cache-count]"
    )
    .forEach(
      el =>
        (el.textContent =
          this.numberFormat(count))
    );

  document
    .querySelectorAll(
      "[data-api-last-sync]"
    )
    .forEach(
      el =>
        (el.textContent =
          lastSync)
    );
},

addHistory(item) {
  try {
    const current =
      JSON.parse(
        localStorage.getItem(
          this.historyKey
        ) || "[]"
      );

    const history =
      Array.isArray(current)
        ? current
        : [];

    history.unshift({
      id:
        `API-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
      at:
        new Date().toISOString(),
      ...item
    });

    localStorage.setItem(
      this.historyKey,
      JSON.stringify(
        history.slice(0, 50)
      )
    );

    this.renderHistory();
  } catch {
    /* history is optional */
  }
},

readHistory() {
  try {
    const data =
      JSON.parse(
        localStorage.getItem(
          this.historyKey
        ) || "[]"
      );

    return Array.isArray(data)
      ? data
      : [];
  } catch {
    return [];
  }
},

renderHistory() {
  const box =
    document.querySelector(
      "[data-api-history],#apiHistory"
    );

  if (!box) return;

  const history =
    this.readHistory();

  if (!history.length) {
    box.innerHTML =
      `<div class="empty-state">
        هنوز درخواست API ثبت نشده است.
      </div>`;
    return;
  }

  box.innerHTML =
    history
      .slice(0, 20)
      .map(item => {
        const date =
          new Date(
            item.at
          ).toLocaleString(
            "fa-IR"
          );

        return `
          <div class="api-history-item ${
            item.ok
              ? "is-success"
              : "is-error"
          }">
            <div>
              <strong>
                ${
                  item.type === "sync"
                    ? "همگام‌سازی"
                    : "تست اتصال"
                }
              </strong>
              <small>
                ${this.escape(
                  item.message || ""
                )}
              </small>
            </div>
            <div>
              <span>
                ${
                  item.status ||
                  "-"
                }
              </span>
              <time>${date}</time>
            </div>
          </div>
        `;
      })
      .join("");
},

clearHistory() {
  localStorage.removeItem(
    this.historyKey
  );
  this.renderHistory();

  this.notify(
    "تاریخچه API پاک شد.",
    "success"
  );
},

resetConfig() {
  const confirmed =
    window.confirm(
      "همه تنظیمات API به حالت اولیه برگردد؟"
    );

  if (!confirmed) return;

  localStorage.removeItem(
    this.storageKey
  );

  this.loadConfigToForm();
  this.renderConnectionState();
  this.setupAutoSync();

  this.notify(
    "تنظیمات API بازنشانی شد.",
    "success"
  );
},

cancelRequest() {
  if (
    this.requestController
  ) {
    this.requestController.abort();
    this.requestController =
      null;

    this.setBusy(false);

    this.notify(
      "درخواست API لغو شد.",
      "info"
    );
  }
},

setupAutoSync() {
  if (this.syncTimer) {
    clearInterval(
      this.syncTimer
    );
    this.syncTimer = null;
  }

  const config =
    this.getConfig();

  if (
    !config.enabled ||
    !config.autoSync ||
    !config.baseUrl
  ) {
    return;
  }

  const interval =
    Math.max(
      1,
      Number(
        config.syncInterval
      ) || 15
    ) * 60 * 1000;

  this.syncTimer =
    setInterval(
      () => {
        if (
          document.visibilityState ===
            "hidden" ||
          this.requestController
        ) {
          return;
        }

        this.sync({
          silent: true
        });
      },
      interval
    );
},

setBusy(
  busy,
  message = ""
) {
  document
    .querySelectorAll(
      "[data-api-loading]"
    )
    .forEach(
      el =>
        (el.hidden = !busy)
    );

  document
    .querySelectorAll(
      "[data-api-action='test'],[data-api-action='sync']"
    )
    .forEach(button => {
      button.disabled =
        Boolean(busy);
    });

  if (message) {
    document
      .querySelectorAll(
        "[data-api-status],#apiStatus"
      )
      .forEach(
        el =>
          (el.textContent =
            message)
      );
  }
},

setConnectionState(
  state,
  text
) {
  document
    .querySelectorAll(
      "[data-api-connection]"
    )
    .forEach(el => {
      el.dataset.state =
        state;

      el.textContent =
        text ||
        state;
    });

  document
    .querySelectorAll(
      "[data-api-status],#apiStatus"
    )
    .forEach(
      el =>
        (el.textContent =
          text || state)
    );
},

renderConnectionState() {
  const config =
    this.getConfig();

  if (!config.baseUrl) {
    this.setConnectionState(
      "idle",
      "API تنظیم نشده"
    );
    return;
  }

  this.setConnectionState(
    config.enabled
      ? "configured"
      : "disabled",
    config.enabled
      ? "API آماده اتصال"
      : "API غیرفعال"
  );
},

toggleSecret(target) {
  if (!target) return;

  const input =
    document.querySelector(
      `[name="${target}"],[data-api-field="${target}"],#${target}`
    );

  if (!input) return;

  const isPassword =
    input.type ===
    "password";

  input.type =
    isPassword
      ? "text"
      : "password";
},

numberFormat(value) {
  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 0
    }
  ).format(
    Number(value) || 0
  );
},

escape(value) {
  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
},

notify(
  message,
  type = "info"
) {
  if (
    window.TipaxApp &&
    typeof window.TipaxApp.toast ===
      "function"
  ) {
    window.TipaxApp.toast(
      message,
      type
    );
    return;
  }

  if (
    window.Tipax &&
    typeof window.Tipax.toast ===
      "function"
  ) {
    window.Tipax.toast(
      message,
      type
    );
    return;
  }

  const toast =
    document.getElementById(
      "toast"
    );

  if (!toast) {
    console.log(
      `[Tipax] ${message}`
    );
    return;
  }

  toast.textContent =
    message;

  toast.dataset.type =
    type;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    this.toastTimer
  );

  this.toastTimer =
    setTimeout(
      () =>
        toast.classList.remove(
          "show"
        ),
      2800
    );
}

};

window.TipaxAPI = TipaxAPI;

window.tipaxApiRequest =
options =>
TipaxAPI.request(options);

window.tipaxApiSync =
options =>
TipaxAPI.sync(options);

if (
document.readyState ===
"loading"
) {
document.addEventListener(
"DOMContentLoaded",
() => TipaxAPI.init(),
{ once: true }
);
} else {
TipaxAPI.init();
}
})();
