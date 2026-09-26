(() => {
"use strict";

const Register = {
initialized: false,
form: null,
toastTimer: null,

config: {
  draftKey: "tipax-draft-register",
  shipmentKey: "tipax-manual-shipments",
  themeKey: "tipax-theme",
  previewId: "preview",
  previewGridId: "previewGrid"
},

fields: [
  "barcode",
  "date",
  "contract",
  "service",
  "sender",
  "receiver",
  "province",
  "dest",
  "receiverPhone",
  "address",
  "amount",
  "paymentStatus",
  "weight",
  "packageCount",
  "box",
  "content",
  "vehicle",
  "status",
  "handed",
  "routeError",
  "notes"
],

init() {
  if (this.initialized) return;
  this.initialized = true;

  this.form = document.getElementById("shipmentForm");
  if (!this.form) return;

  this.applyTheme();
  this.bindTheme();
  this.bindMenu();
  this.bindForm();
  this.bindPreview();
  this.bindDraft();
  this.bindFormatting();
  this.bindQueryData();
  this.bindKeyboard();
  this.restoreDraftIfAvailable();
  this.setDefaultDate();
},

applyTheme() {
  if (localStorage.getItem(this.config.themeKey) === "dark") {
    document.body.classList.add("dark");
  }
},

bindTheme() {
  document.querySelectorAll("[data-theme-toggle]").forEach(button => {
    button.addEventListener("click", () => this.toggleTheme());
  });

  window.toggleTheme = () => this.toggleTheme();
},

toggleTheme() {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    this.config.themeKey,
    document.body.classList.contains("dark")
      ? "dark"
      : "light"
  );

  document.dispatchEvent(
    new CustomEvent("tipax:theme-changed", {
      detail: {
        theme: document.body.classList.contains("dark")
          ? "dark"
          : "light"
      }
    })
  );
},

bindMenu() {
  document.querySelectorAll("[data-menu-toggle]").forEach(button => {
    button.addEventListener("click", () => this.toggleMenu());
  });

  window.toggleMenu = () => this.toggleMenu();

  const overlay = document.querySelector(".overlay");

  if (overlay) {
    overlay.addEventListener("click", () => this.closeMenu());
  }
},

toggleMenu() {
  document.body.classList.toggle("menu-open");
},

closeMenu() {
  document.body.classList.remove("menu-open");
},

bindForm() {
  this.form.addEventListener("submit", event => {
    event.preventDefault();
    this.submit();
  });

  this.form.addEventListener("input", event => {
    const target = event.target;

    if (target.matches("[required]")) {
      this.clearFieldError(target);
    }

    if (
      target.name === "amount" ||
      target.name === "weight" ||
      target.name === "packageCount"
    ) {
      this.formatField(target);
    }
  });

  this.form.addEventListener("change", event => {
    const target = event.target;

    if (target.matches("[required]")) {
      this.clearFieldError(target);
    }

    if (
      target.name === "payment" ||
      target.name === "status" ||
      target.name === "routeError" ||
      target.name === "handed"
    ) {
      this.updateFormState();
    }
  });
},

bindPreview() {
  document.querySelectorAll("[data-preview-form]").forEach(button => {
    button.addEventListener("click", () => this.preview());
  });

  window.previewForm = () => this.preview();
},

bindDraft() {
  document.querySelectorAll("[data-save-draft]").forEach(button => {
    button.addEventListener("click", () => this.saveDraft());
  });

  window.saveDraft = () => this.saveDraft();

  document.querySelectorAll("[data-reset-form]").forEach(button => {
    button.addEventListener("click", () => this.reset());
  });

  window.resetForm = () => this.reset();
},

bindFormatting() {
  const amount = this.form.querySelector('[name="amount"]');

  if (amount) {
    amount.addEventListener("blur", () => {
      amount.value = this.formatMoneyInput(amount.value);
    });

    amount.addEventListener("focus", () => {
      amount.value = this.unformatNumber(amount.value);
    });
  }

  const phone = this.form.querySelector('[name="receiverPhone"]');

  if (phone) {
    phone.addEventListener("input", () => {
      phone.value = this.toEnglishDigits(phone.value)
        .replace(/[^\d+]/g, "")
        .slice(0, 15);
    });
  }

  const packageCount = this.form.querySelector(
    '[name="packageCount"]'
  );

  if (packageCount) {
    packageCount.addEventListener("input", () => {
      const value = this.toNumber(packageCount.value);

      packageCount.value = value > 0 ? String(value) : "1";
    });
  }
},

bindQueryData() {
  const params = new URLSearchParams(window.location.search);
  const barcode = params.get("barcode");

  if (barcode) {
    const input = this.form.querySelector('[name="barcode"]');

    if (input) {
      input.value = barcode;
    }
  }

  const editId = params.get("id");

  if (editId) {
    this.loadShipmentForEdit(editId);
  }
},

bindKeyboard() {
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      this.closeMenu();
    }

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();
      this.saveDraft();
    }
  });
},

setDefaultDate() {
  const date = this.form.querySelector('[name="date"]');

  if (!date || date.value.trim()) return;

  const now = new Date();

  const formatter = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  date.value = formatter.format(now);
},

getData() {
  const data = {};

  this.fields.forEach(name => {
    const field = this.form.querySelector(
      `[name="${name}"]`
    );

    if (!field) return;

    if (field.type === "checkbox") {
      data[name] = field.checked;
    } else {
      data[name] = String(field.value || "").trim();
    }
  });

  const payment = this.form.querySelector(
    'input[name="payment"]:checked'
  );

  data.payment = payment
    ? payment.value
    : "نقدی";

  data.amount = this.toNumber(data.amount);
  data.weight = this.extractNumber(data.weight);
  data.packageCount = Math.max(
    1,
    this.toNumber(data.packageCount) || 1
  );

  data.routeError = data.routeError === "بله";
  data.createdAt =
    data.createdAt || new Date().toISOString();

  return data;
},

validate() {
  let valid = true;
  let firstInvalid = null;

  this.form.querySelectorAll("[required]").forEach(field => {
    this.clearFieldError(field);

    let empty = !String(field.value || "").trim();

    if (
      field.type === "radio" &&
      field.name === "payment"
    ) {
      empty =
        !this.form.querySelector(
          'input[name="payment"]:checked'
        );
    }

    if (empty) {
      this.showFieldError(field);

      if (!firstInvalid) {
        firstInvalid = field;
      }

      valid = false;
    }
  });

  const barcode = this.form.querySelector(
    '[name="barcode"]'
  );

  if (
    barcode &&
    barcode.value.trim() &&
    barcode.value.trim().length < 3
  ) {
    this.showFieldError(
      barcode,
      "بارکد یا شماره مرسوله معتبر نیست."
    );

    firstInvalid ||= barcode;
    valid = false;
  }

  const phone = this.form.querySelector(
    '[name="receiverPhone"]'
  );

  if (phone && phone.value.trim()) {
    const normalized = this.toEnglishDigits(
      phone.value
    ).replace(/\D/g, "");

    if (
      normalized.length > 0 &&
      !/^09\d{9}$/.test(normalized)
    ) {
      this.showFieldError(
        phone,
        "شماره تماس را به شکل 09xxxxxxxxx وارد کنید."
      );

      firstInvalid ||= phone;
      valid = false;
    }
  }

  if (!valid) {
    this.notify(
      "لطفاً فیلدهای ضروری و اطلاعات نادرست را اصلاح کنید.",
      "error"
    );

    firstInvalid?.focus();

    firstInvalid?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  return valid;
},

showFieldError(field, message = "تکمیل این فیلد ضروری است.") {
  field.classList.add("error");

  const parent = field.parentElement;
  if (!parent) return;

  let error = parent.querySelector(".error-text");

  if (!error) {
    error = document.createElement("div");
    error.className = "error-text";
    parent.appendChild(error);
  }

  error.textContent = message;
  error.classList.add("show");
},

clearFieldError(field) {
  field.classList.remove("error");

  const error =
    field.parentElement?.querySelector(".error-text");

  if (error) {
    error.classList.remove("show");
  }
},

preview() {
  if (!this.validate()) return;

  const data = this.getData();

  const labels = {
    barcode: "بارکد",
    date: "تاریخ ثبت",
    contract: "قرارداد / مشتری",
    service: "نوع سرویس",
    sender: "فرستنده",
    receiver: "گیرنده",
    province: "استان",
    dest: "شهر مقصد",
    receiverPhone: "شماره تماس",
    address: "آدرس",
    payment: "نوع پرداخت",
    amount: "مبلغ",
    paymentStatus: "وضعیت پرداخت",
    weight: "وزن",
    packageCount: "تعداد بسته",
    box: "سایز کارتن",
    content: "نوع محتوا",
    vehicle: "پخش‌کننده",
    status: "وضعیت مرسوله",
    handed: "تحویل به پخش‌کننده",
    routeError: "اشتباه مسیر",
    notes: "توضیحات"
  };

  const previewGrid =
    document.getElementById(this.config.previewGridId);

  const preview =
    document.getElementById(this.config.previewId);

  if (!previewGrid || !preview) return;

  previewGrid.innerHTML = Object.entries(labels)
    .map(([key, label]) => {
      let value = data[key];

      if (key === "amount") {
        value = this.formatMoney(value);
      }

      if (key === "routeError") {
        value = value ? "بله" : "خیر";
      }

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        value = "—";
      }

      return `
        <div class="preview-item">
          <small>${this.escape(label)}</small>
          <b>${this.escape(String(value))}</b>
        </div>
      `;
    })
    .join("");

  preview.classList.add("open");

  preview.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  document.dispatchEvent(
    new CustomEvent("tipax:register-preview", {
      detail: data
    })
  );
},

saveDraft() {
  const data = this.getData();

  data.savedAt = new Date().toISOString();

  try {
    localStorage.setItem(
      this.config.draftKey,
      JSON.stringify(data)
    );

    this.notify(
      "اطلاعات فرم به‌صورت موقت ذخیره شد.",
      "success"
    );

    document.dispatchEvent(
      new CustomEvent("tipax:register-draft-saved", {
        detail: data
      })
    );

    return true;
  } catch {
    this.notify(
      "ذخیره موقت انجام نشد.",
      "error"
    );

    return false;
  }
},

restoreDraftIfAvailable() {
  let raw = null;

  try {
    raw = localStorage.getItem(
      this.config.draftKey
    );
  } catch {
    return;
  }

  if (!raw) return;

  let draft;

  try {
    draft = JSON.parse(raw);
  } catch {
    return;
  }

  if (!draft || typeof draft !== "object") return;

  const restore = window.confirm(
    "اطلاعات موقت قبلی برای این فرم پیدا شد. می‌خواهید آن را بازیابی کنید؟"
  );

  if (!restore) return;

  this.fill(draft);

  this.notify(
    "اطلاعات موقت بازیابی شد.",
    "success"
  );
},

fill(data = {}) {
  this.fields.forEach(name => {
    const field = this.form.querySelector(
      `[name="${name}"]`
    );

    if (!field || data[name] === undefined) return;

    if (field.type === "checkbox") {
      field.checked = Boolean(data[name]);
    } else {
      field.value = data[name];
    }
  });

  if (data.payment) {
    const payment = this.form.querySelector(
      `input[name="payment"][value="${CSS.escape(
        data.payment
      )}"]`
    );

    if (payment) payment.checked = true;
  }

  this.updateFormState();
},

reset() {
  const confirmed = window.confirm(
    "همه اطلاعات واردشده در فرم پاک شود؟"
  );

  if (!confirmed) return;

  this.form.reset();

  this.form
    .querySelectorAll(".error")
    .forEach(field =>
      this.clearFieldError(field)
    );

  document
    .getElementById(this.config.previewId)
    ?.classList.remove("open");

  try {
    localStorage.removeItem(this.config.draftKey);
  } catch {}

  this.setDefaultDate();
  this.updateFormState();

  this.notify(
    "فرم پاک شد.",
    "success"
  );

  document.dispatchEvent(
    new CustomEvent("tipax:register-reset")
  );
},

submit() {
  if (!this.validate()) return;

  const data = this.getData();

  const params = new URLSearchParams(
    window.location.search
  );

  const editId = params.get("id");

  if (editId) {
    const updated = this.updateExisting(
      editId,
      data
    );

    if (updated) {
      this.notify(
        "اطلاعات مرسوله با موفقیت ویرایش شد.",
        "success"
      );

      this.removeDraft();

      setTimeout(() => {
        window.location.href = "shipments.html";
      }, 700);

      return;
    }
  }

  const record = {
    ...data,
    id: `MAN-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: "manual"
  };

  const saved = this.readShipments();

  saved.push(record);

  if (!this.writeShipments(saved)) {
    this.notify(
      "ثبت مرسوله انجام نشد. فضای ذخیره‌سازی مرورگر را بررسی کنید.",
      "error"
    );
    return;
  }

  this.removeDraft();

  this.notify(
    "مرسوله با موفقیت ثبت شد.",
    "success"
  );

  document.dispatchEvent(
    new CustomEvent("tipax:register-saved", {
      detail: record
    })
  );

  setTimeout(() => {
    window.location.href = "shipments.html";
  }, 700);
},

loadShipmentForEdit(id) {
  const shipments = this.readShipments();

  const record = shipments.find(
    item =>
      String(item.id) === String(id) ||
      String(item.barcode) === String(id)
  );

  if (!record) {
    this.notify(
      "مرسوله موردنظر پیدا نشد.",
      "error"
    );
    return;
  }

  this.fill(record);

  this.form.dataset.editingId = record.id;

  const title = document.querySelector(
    ".page-head h2"
  );

  if (title) {
    title.textContent = "ویرایش اطلاعات مرسوله";
  }

  const submit = this.form.querySelector(
    'button[type="submit"]'
  );

  if (submit) {
    submit.textContent = "✓ ذخیره تغییرات";
  }
},

updateExisting(id, data) {
  const shipments = this.readShipments();

  const index = shipments.findIndex(
    item => String(item.id) === String(id)
  );

  if (index === -1) return null;

  const existing = shipments[index];

  shipments[index] = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt:
      existing.createdAt ||
      new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return this.writeShipments(shipments)
    ? shipments[index]
    : null;
},

readShipments() {
  const keys = [
    this.config.shipmentKey,
    "tipax_shipments"
  ];

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {}
  }

  return [];
},

writeShipments(data) {
  try {
    localStorage.setItem(
      this.config.shipmentKey,
      JSON.stringify(data)
    );

    localStorage.setItem(
      "tipax_shipments",
      JSON.stringify(data)
    );

    return true;
  } catch {
    return false;
  }
},

removeDraft() {
  try {
    localStorage.removeItem(
      this.config.draftKey
    );
  } catch {}
},

updateFormState() {
  const payment = this.form.querySelector(
    'input[name="payment"]:checked'
  )?.value;

  const status = this.form.querySelector(
    '[name="status"]'
  )?.value;

  document.body.dataset.payment =
    payment || "نقدی";

  document.body.dataset.shipmentStatus =
    status || "";

  document.dispatchEvent(
    new CustomEvent("tipax:register-state", {
      detail: {
        payment,
        status
      }
    })
  );
},

formatField(field) {
  if (field.name === "amount") {
    const raw = this.unformatNumber(field.value);

    if (raw !== "") {
      field.value =
        new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 0
        }).format(this.toNumber(raw));
    }
  }
},

formatMoneyInput(value) {
  const number = this.toNumber(value);

  if (!number) return "";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(number);
},

formatMoney(value) {
  return `${this.formatMoneyInput(value)} تومان`;
},

unformatNumber(value) {
  return this.toEnglishDigits(
    String(value ?? "")
  )
    .replace(/,/g, "")
    .replace(/٬/g, "")
    .replace(/[^\d.-]/g, "");
},

extractNumber(value) {
  const normalized = this.unformatNumber(value);
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
},

toNumber(value) {
  const number = Number(
    this.unformatNumber(value)
  );

  return Number.isFinite(number) ? number : 0;
},

toEnglishDigits(value) {
  return String(value ?? "")
    .replace(/[۰-۹]/g, digit =>
      String(
        "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)
      )
    )
    .replace(/[٠-٩]/g, digit =>
      String(
        "٠١٢٣٤٥٦٧٨٩".indexOf(digit)
      )
    );
},

escape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
},

notify(message, type = "info") {
  const toast =
    document.getElementById("toast");

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
  }, 2600);
},

scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

};

window.TipaxRegister = Register;

window.getRegisterData = () =>
Register.getData();

window.toggleTheme = () =>
Register.toggleTheme();

window.toggleMenu = () =>
Register.toggleMenu();

window.previewForm = () =>
Register.preview();

window.saveDraft = () =>
Register.saveDraft();

window.resetForm = () =>
Register.reset();

if (document.readyState === "loading") {
document.addEventListener(
"DOMContentLoaded",
() => Register.init(),
{ once: true }
);
} else {
Register.init();
}
})();
