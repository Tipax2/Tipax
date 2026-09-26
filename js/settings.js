(() => {
"use strict";

const TipaxSettings = {
initialized: false,
storageKey: "tipax-settings",
themeKey: "tipax-theme",
branchKey: "tipax-branch-settings",
defaults: {
theme: "dark",
language: "fa",
fontSize: "medium",
compactMode: false,
animations: true,
glassEffects: true,
notifications: true,
autoRefresh: false,
refreshInterval: 5,
defaultPageSize: 25,
dateFormat: "jalali",
numberFormat: "en-US",
currency: "تومان",
branchName: "شعبه تیپاکس",
branchCode: "",
branchPhone: "",
branchAddress: "",
managerName: "",
workingHours: "08:00-18:00",
weekend: "پنجشنبه و جمعه",
defaultPayment: "نقدی",
defaultCourier: "",
defaultStatus: "ثبت شده",
showSensitiveData: false,
confirmDelete: true,
rememberFilters: true,
saveDrafts: true
},
timer: null,

init() {
  if (this.initialized) return;
  this.initialized = true;
  this.bindEvents();
  this.apply();
  this.loadForm();
  this.renderSummary();
  this.setupAutoRefresh();
},

bindEvents() {
  document.addEventListener("submit", e => {
    const form = e.target.closest("[data-settings-form],#settingsForm");
    if (!form) return;
    e.preventDefault();
    this.saveFromForm(form);
  });

  document.addEventListener("click", e => {
    const button = e.target.closest("[data-settings-action]");
    if (!button) return;

    e.preventDefault();

    switch (button.dataset.settingsAction) {
      case "save":
        this.saveFromPage();
        break;
      case "reset":
        this.reset();
        break;
      case "reset-all":
        this.resetAll();
        break;
      case "export":
        this.exportSettings();
        break;
      case "import":
        this.triggerImport();
        break;
      case "clear":
        this.clearLocalData();
        break;
      case "theme":
        this.toggleTheme();
        break;
    }
  });

  document.addEventListener("change", e => {
    const theme = e.target.closest("[data-theme-select]");
    if (theme) {
      this.setTheme(theme.value);
      this.savePartial({ theme: theme.value }, false);
    }

    const auto = e.target.closest("[data-auto-refresh]");
    if (auto) {
      this.savePartial({ autoRefresh: auto.checked }, false);
      this.setupAutoRefresh();
    }
  });

  document.addEventListener("input", e => {
    const range = e.target.closest("[data-settings-range]");
    if (!range) return;

    const target = document.querySelector(
      `[data-range-value="${range.name || range.dataset.settingsRange}"]`
    );

    if (target) target.textContent = range.value;
  });

  document.addEventListener("change", e => {
    const input = e.target.closest("[data-settings-import]");
    if (!input) return;
    this.importSettings(input.files?.[0]);
    input.value = "";
  });

  window.addEventListener("storage", e => {
    if (
      e.key === this.storageKey ||
      e.key === this.themeKey ||
      e.key === this.branchKey
    ) {
      this.apply();
      this.loadForm();
      this.renderSummary();
    }
  });
},

read() {
  try {
    const value = JSON.parse(
      localStorage.getItem(this.storageKey) || "null"
    );
    return {
      ...this.defaults,
      ...(value && typeof value === "object" ? value : {})
    };
  } catch {
    return { ...this.defaults };
  }
},

readBranch() {
  try {
    const value = JSON.parse(
      localStorage.getItem(this.branchKey) || "null"
    );
    return {
      branchName: "",
      branchCode: "",
      branchPhone: "",
      branchAddress: "",
      managerName: "",
      workingHours: "",
      weekend: "",
      ...(value && typeof value === "object" ? value : {})
    };
  } catch {
    return {
      branchName: "",
      branchCode: "",
      branchPhone: "",
      branchAddress: "",
      managerName: "",
      workingHours: "",
      weekend: ""
    };
  }
},

save(settings, notify = true) {
  const normalized = this.normalize({
    ...this.read(),
    ...settings
  });

  try {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(normalized)
    );

    this.apply();
    this.setupAutoRefresh();
    this.renderSummary();

    document.dispatchEvent(
      new CustomEvent("tipax:settings-changed", {
        detail: { settings: normalized }
      })
    );

    if (notify) {
      this.toast("تنظیمات با موفقیت ذخیره شد.", "success");
    }

    return normalized;
  } catch {
    this.toast("ذخیره تنظیمات انجام نشد.", "error");
    return null;
  }
},

savePartial(partial, notify = true) {
  return this.save(partial, notify);
},

saveFromPage() {
  const form = document.querySelector(
    "[data-settings-form],#settingsForm"
  );

  if (!form) {
    this.toast("فرم تنظیمات پیدا نشد.", "error");
    return;
  }

  this.saveFromForm(form);
},

saveFromForm(form) {
  const current = this.read();

  const field = name => {
    const input = form.querySelector(
      `[name="${name}"],[data-settings-field="${name}"]`
    );
    return input ? input.value : undefined;
  };

  const checked = name => {
    const input = form.querySelector(
      `[name="${name}"],[data-settings-field="${name}"]`
    );
    return input?.type === "checkbox"
      ? input.checked
      : undefined;
  };

  const value = (name, fallback) => {
    const v = field(name);
    return v === undefined ? fallback : v;
  };

  const bool = (name, fallback) => {
    const v = checked(name);
    return v === undefined ? fallback : Boolean(v);
  };

  const settings = {
    theme: value("theme", current.theme),
    language: value("language", current.language),
    fontSize: value("fontSize", current.fontSize),
    compactMode: bool("compactMode", current.compactMode),
    animations: bool("animations", current.animations),
    glassEffects: bool("glassEffects", current.glassEffects),
    notifications: bool("notifications", current.notifications),
    autoRefresh: bool("autoRefresh", current.autoRefresh),
    refreshInterval: Number(
      value("refreshInterval", current.refreshInterval)
    ) || current.refreshInterval,
    defaultPageSize: Number(
      value("defaultPageSize", current.defaultPageSize)
    ) || current.defaultPageSize,
    dateFormat: value("dateFormat", current.dateFormat),
    numberFormat: value("numberFormat", current.numberFormat),
    currency: value("currency", current.currency),
    defaultPayment: value("defaultPayment", current.defaultPayment),
    defaultCourier: value("defaultCourier", current.defaultCourier),
    defaultStatus: value("defaultStatus", current.defaultStatus),
    showSensitiveData: bool(
      "showSensitiveData",
      current.showSensitiveData
    ),
    confirmDelete: bool("confirmDelete", current.confirmDelete),
    rememberFilters: bool(
      "rememberFilters",
      current.rememberFilters
    ),
    saveDrafts: bool("saveDrafts", current.saveDrafts)
  };

  const branch = {
    branchName: value("branchName", current.branchName),
    branchCode: value("branchCode", current.branchCode),
    branchPhone: value("branchPhone", current.branchPhone),
    branchAddress: value("branchAddress", current.branchAddress),
    managerName: value("managerName", current.managerName),
    workingHours: value("workingHours", current.workingHours),
    weekend: value("weekend", current.weekend)
  };

  const saved = this.save({
    ...settings,
    ...branch
  });

  if (saved) {
    try {
      localStorage.setItem(
        this.branchKey,
        JSON.stringify(branch)
      );
    } catch {}
    this.loadForm();
    this.toast("تنظیمات کامل پروژه ذخیره شد.", "success");
  }
},

normalize(settings) {
  const allowedThemes = ["dark", "light", "system"];
  const allowedSizes = ["small", "medium", "large", "xlarge"];

  return {
    ...this.defaults,
    ...settings,
    theme: allowedThemes.includes(settings.theme)
      ? settings.theme
      : "dark",
    fontSize: allowedSizes.includes(settings.fontSize)
      ? settings.fontSize
      : "medium",
    refreshInterval: Math.max(
      1,
      Math.min(1440, Number(settings.refreshInterval) || 5)
    ),
    defaultPageSize: Math.max(
      10,
      Math.min(500, Number(settings.defaultPageSize) || 25)
    )
  };
},

loadForm() {
  const settings = this.read();

  document
    .querySelectorAll("[data-settings-form],#settingsForm")
    .forEach(form => {
      const set = (name, value) => {
        const input = form.querySelector(
          `[name="${name}"],[data-settings-field="${name}"]`
        );
        if (!input) return;

        if (input.type === "checkbox") {
          input.checked = Boolean(value);
        } else {
          input.value = value ?? "";
        }
      };

      Object.entries(settings).forEach(([key, value]) => {
        set(key, value);
      });
    });

  document
    .querySelectorAll("[data-theme-select]")
    .forEach(el => (el.value = settings.theme));

  document
    .querySelectorAll("[data-auto-refresh]")
    .forEach(el => (el.checked = settings.autoRefresh));
},

apply() {
  const settings = this.read();
  const root = document.documentElement;

  const actualTheme =
    settings.theme === "system"
      ? (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        )
      : settings.theme;

  root.dataset.theme = actualTheme;
  root.dataset.fontSize = settings.fontSize;
  root.dataset.compact = settings.compactMode ? "true" : "false";
  root.dataset.animations = settings.animations ? "true" : "false";
  root.dataset.glass = settings.glassEffects ? "true" : "false";

  root.style.colorScheme = actualTheme;

  document.body?.classList.toggle(
    "theme-dark",
    actualTheme === "dark"
  );
  document.body?.classList.toggle(
    "theme-light",
    actualTheme === "light"
  );
  document.body?.classList.toggle(
    "compact-mode",
    settings.compactMode
  );
  document.body?.classList.toggle(
    "no-animations",
    !settings.animations
  );
  document.body?.classList.toggle(
    "no-glass",
    !settings.glassEffects
  );

  this.updateThemeButtons(actualTheme);

  document.dispatchEvent(
    new CustomEvent("tipax:theme-applied", {
      detail: {
        theme: actualTheme,
        settings
      }
    })
  );
},

setTheme(theme) {
  if (!["dark", "light", "system"].includes(theme)) {
    theme = "dark";
  }

  this.savePartial({ theme }, false);
  this.apply();
},

toggleTheme() {
  const current = this.read();
  const actual =
    current.theme === "system"
      ? (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        )
      : current.theme;

  this.setTheme(actual === "dark" ? "light" : "dark");
  this.toast(
    `حالت ${actual === "dark" ? "روشن" : "تاریک"} فعال شد.`,
    "success"
  );
},

updateThemeButtons(theme) {
  document
    .querySelectorAll("[data-settings-theme]")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.settingsTheme === theme
      );
      button.setAttribute(
        "aria-pressed",
        button.dataset.settingsTheme === theme
          ? "true"
          : "false"
      );
    });
},

setupAutoRefresh() {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }

  const settings = this.read();

  if (!settings.autoRefresh) return;

  const ms =
    Math.max(
      1,
      Number(settings.refreshInterval) || 5
    ) * 60 * 1000;

  this.timer = setInterval(() => {
    if (document.visibilityState === "hidden") return;

    document.dispatchEvent(
      new CustomEvent("tipax:auto-refresh", {
        detail: {
          interval: settings.refreshInterval
        }
      })
    );

    if (window.TipaxAPI?.sync) {
      window.TipaxAPI.sync({ silent: true });
    }
  }, ms);
},

reset() {
  if (
    !window.confirm(
      "تنظیمات ظاهری و عمومی به حالت پیش‌فرض برگردد؟"
    )
  ) return;

  const current = this.read();

  this.save({
    ...this.defaults,
    branchName: current.branchName,
    branchCode: current.branchCode,
    branchPhone: current.branchPhone,
    branchAddress: current.branchAddress,
    managerName: current.managerName
  });

  this.loadForm();
  this.toast("تنظیمات به حالت پیش‌فرض برگشت.", "success");
},

resetAll() {
  if (
    !window.confirm(
      "تمام تنظیمات ذخیره‌شده پروژه حذف شود؟ این عملیات قابل بازگشت نیست."
    )
  ) return;

  localStorage.removeItem(this.storageKey);
  localStorage.removeItem(this.branchKey);
  localStorage.removeItem(this.themeKey);

  this.apply();
  this.loadForm();
  this.renderSummary();
  this.setupAutoRefresh();

  this.toast(
    "تنظیمات ذخیره‌شده حذف و پروژه بازنشانی شد.",
    "success"
  );
},

exportSettings() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: this.read(),
    branch: this.readBranch()
  };

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: "application/json;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `tipax-settings-${this.fileDate()}.json`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);

  this.toast(
    "فایل پشتیبان تنظیمات ساخته شد.",
    "success"
  );
},

triggerImport() {
  let input = document.querySelector(
    "[data-settings-import]"
  );

  if (!input) {
    input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.hidden = true;
    input.dataset.settingsImport = "true";
    document.body.appendChild(input);
  }

  input.click();
},

async importSettings(file) {
  if (!file) return;

  try {
    const text = await file.text();
    const payload = JSON.parse(text);

    if (
      !payload ||
      typeof payload !== "object" ||
      !payload.settings
    ) {
      throw new Error(
        "ساختار فایل تنظیمات معتبر نیست."
      );
    }

    this.save(payload.settings, false);

    if (
      payload.branch &&
      typeof payload.branch === "object"
    ) {
      localStorage.setItem(
        this.branchKey,
        JSON.stringify(payload.branch)
      );
    }

    this.apply();
    this.loadForm();
    this.renderSummary();

    this.toast(
      "تنظیمات از فایل پشتیبان بازیابی شد.",
      "success"
    );
  } catch (error) {
    this.toast(
      error.message || "بازیابی تنظیمات ناموفق بود.",
      "error"
    );
  }
},

clearLocalData() {
  if (
    !window.confirm(
      "داده‌های محلی پروژه مثل تنظیمات، کش API و اطلاعات واردشده پاک شوند؟"
    )
  ) return;

  const keys = [
    this.storageKey,
    this.branchKey,
    this.themeKey,
    "tipax-api-cache",
    "tipax-api-history",
    "tipax-imported-data",
    "tipax-last-excel-import",
    "tipax-manual-shipments"
  ];

  keys.forEach(key => localStorage.removeItem(key));

  this.apply();
  this.loadForm();
  this.renderSummary();

  document.dispatchEvent(
    new CustomEvent("tipax:local-data-cleared")
  );

  this.toast(
    "داده‌های محلی پروژه پاک شدند.",
    "success"
  );
},

renderSummary() {
  const settings = this.read();

  document
    .querySelectorAll("[data-settings-summary]")
    .forEach(el => {
      const key = el.dataset.settingsSummary;
      let value = settings[key];

      if (typeof value === "boolean") {
        value = value ? "فعال" : "غیرفعال";
      }

      if (key === "theme") {
        value =
          value === "dark"
            ? "تاریک"
            : value === "light"
            ? "روشن"
            : "سیستم";
      }

      el.textContent =
        value === undefined ||
        value === ""
          ? "—"
          : value;
    });

  const branch = this.readBranch();

  document
    .querySelectorAll("[data-branch-summary]")
    .forEach(el => {
      const key = el.dataset.branchSummary;
      el.textContent =
        branch[key] || settings[key] || "—";
    });
},

fileDate() {
  const d = new Date();

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
},

toast(message, type = "info") {
  if (
    window.TipaxApp &&
    typeof window.TipaxApp.toast === "function"
  ) {
    window.TipaxApp.toast(message, type);
    return;
  }

  if (
    window.Tipax &&
    typeof window.Tipax.toast === "function"
  ) {
    window.Tipax.toast(message, type);
    return;
  }

  const toast = document.getElementById("toast");

  if (!toast) {
    console.log(`[Tipax] ${message}`);
    return;
  }

  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.add("show");

  clearTimeout(this.toastTimer);

  this.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

};

window.TipaxSettings = TipaxSettings;

window.tipaxGetSettings = () =>
TipaxSettings.read();

window.tipaxSaveSettings = settings =>
TipaxSettings.save(settings);

window.tipaxSetTheme = theme =>
TipaxSettings.setTheme(theme);

if (document.readyState === "loading") {
document.addEventListener(
"DOMContentLoaded",
() => TipaxSettings.init(),
{ once: true }
);
} else {
TipaxSettings.init();
}
})();
