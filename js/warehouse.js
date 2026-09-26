(() => {
"use strict";

const Warehouse = {
initialized: false,
storageKey: "tipax-warehouse",
movementKey: "tipax-warehouse-movements",

defaultItems: [
  { id: "carton-a3", name: "کارتن A3", category: "کارتن", unit: "عدد", min: 20, qty: 0 },
  { id: "carton-b4", name: "کارتن B4", category: "کارتن", unit: "عدد", min: 20, qty: 0 },
  { id: "flyer-a3", name: "فلایر A3", category: "اقلام مصرفی", unit: "عدد", min: 50, qty: 0 },
  { id: "envelope", name: "پاکت", category: "اقلام مصرفی", unit: "عدد", min: 50, qty: 0 },
  { id: "label", name: "لیبل", category: "اقلام مصرفی", unit: "عدد", min: 50, qty: 0 }
],

init() {
  if (this.initialized) return;
  this.initialized = true;
  this.bindEvents();
  this.refresh();
},

bindEvents() {
  document.addEventListener("submit", e => {
    const form = e.target.closest(
      "[data-warehouse-form], #warehouseForm"
    );
    if (!form) return;

    e.preventDefault();
    this.handleForm(form);
  });

  document.addEventListener("click", e => {
    const action = e.target.closest("[data-warehouse-action]");
    if (!action) return;

    e.preventDefault();

    const type = action.dataset.warehouseAction;

    if (type === "refresh") this.refresh();
    if (type === "reset") this.reset();
    if (type === "export") this.exportCsv();
    if (type === "add") this.openMovement("in");
    if (type === "remove") this.openMovement("out");
    if (type === "close") this.closeMovement();
  });

  document.addEventListener("input", e => {
    if (
      e.target.matches(
        "[data-warehouse-search], #warehouseSearch"
      )
    ) {
      this.render();
    }
  });

  window.addEventListener("storage", e => {
    if (
      e.key === this.storageKey ||
      e.key === this.movementKey
    ) {
      this.refresh();
    }
  });
},

read() {
  try {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      const initial = this.defaultItems.map(item => ({ ...item }));
      this.write(initial);
      return initial;
    }

    const data = JSON.parse(raw);
    return Array.isArray(data)
      ? data
      : this.defaultItems.map(item => ({ ...item }));
  } catch {
    return this.defaultItems.map(item => ({ ...item }));
  }
},

write(data) {
  try {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(data)
    );
    return true;
  } catch {
    return false;
  }
},

movements() {
  try {
    const raw = localStorage.getItem(this.movementKey);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
},

saveMovement(movement) {
  const list = this.movements();
  list.push(movement);

  try {
    localStorage.setItem(
      this.movementKey,
      JSON.stringify(list)
    );
    return true;
  } catch {
    return false;
  }
},

handleForm(form) {
  const data = new FormData(form);

  const itemId = String(
    data.get("item") ||
    data.get("itemId") ||
    ""
  ).trim();

  const type = String(
    data.get("type") ||
    "in"
  ).trim();

  const quantity = this.number(
    data.get("quantity")
  );

  const note = String(
    data.get("note") ||
    data.get("description") ||
    ""
  ).trim();

  if (!itemId || quantity <= 0) {
    this.notify(
      "قلم و تعداد معتبر را وارد کنید.",
      "error"
    );
    return;
  }

  const updated = this.changeStock(
    itemId,
    type,
    quantity
  );

  if (!updated) return;

  this.saveMovement({
    id: `WH-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    itemId,
    type,
    quantity,
    note,
    createdAt: new Date().toISOString()
  });

  form.reset();
  this.closeMovement();
  this.refresh();

  this.notify(
    type === "out"
      ? "خروج از انبار ثبت شد."
      : "ورود به انبار ثبت شد.",
    "success"
  );
},

changeStock(itemId, type, quantity) {
  const items = this.read();
  const index = items.findIndex(
    item => String(item.id) === itemId
  );

  if (index === -1) {
    this.notify("قلم موردنظر پیدا نشد.", "error");
    return false;
  }

  const current = this.number(items[index].qty);

  if (type === "out" && current < quantity) {
    this.notify(
      "موجودی کافی برای خروج این مقدار وجود ندارد.",
      "error"
    );
    return false;
  }

  items[index].qty =
    type === "out"
      ? current - quantity
      : current + quantity;

  items[index].updatedAt =
    new Date().toISOString();

  return this.write(items);
},

openMovement(type) {
  const panel =
    document.querySelector(
      "[data-warehouse-movement], #warehouseMovement"
    );

  if (!panel) return;

  panel.hidden = false;
  panel.dataset.type = type;

  const typeField =
    panel.querySelector(
      "[name='type']"
    );

  if (typeField) {
    typeField.value = type;
  }

  panel.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
},

closeMovement() {
  const panel =
    document.querySelector(
      "[data-warehouse-movement], #warehouseMovement"
    );

  if (panel) panel.hidden = true;
},

filtered() {
  const search =
    String(
      document.querySelector(
        "[data-warehouse-search], #warehouseSearch"
      )?.value || ""
    )
      .trim()
      .toLocaleLowerCase("fa");

  const category =
    document.querySelector(
      "[data-warehouse-category]"
    )?.value || "all";

  return this.read().filter(item => {
    const matchesSearch =
      !search ||
      `${item.name} ${item.category} ${item.id}`
        .toLocaleLowerCase("fa")
        .includes(search);

    const matchesCategory =
      category === "all" ||
      item.category === category;

    return matchesSearch && matchesCategory;
  });
},

render() {
  const items = this.filtered();
  const container =
    document.querySelector(
      "[data-warehouse-list], #warehouseList"
    );

  if (!container) return;

  if (!items.length) {
    container.innerHTML =
      `<div class="empty-state">قلمی برای نمایش وجود ندارد.</div>`;
    return;
  }

  container.innerHTML = items
    .map(item => {
      const qty = this.number(item.qty);
      const min = this.number(item.min);
      const low = qty <= min;
      const percent = min
        ? Math.min(100, Math.round((qty / min) * 100))
        : 100;

      return `
        <article
          class="warehouse-card ${low ? "is-low" : ""}"
          data-item-id="${this.escape(item.id)}"
        >
          <div class="warehouse-card-head">
            <div>
              <small>${this.escape(item.category)}</small>
              <h3>${this.escape(item.name)}</h3>
            </div>

            <span class="warehouse-badge ${low ? "danger" : "ok"}">
              ${low ? "موجودی کم" : "موجود"}
            </span>
          </div>

          <div class="warehouse-stock">
            <strong>${this.numberFormat(qty)}</strong>
            <span>${this.escape(item.unit)}</span>
          </div>

          <div class="warehouse-progress">
            <i style="width:${percent}%"></i>
          </div>

          <div class="warehouse-meta">
            <span>حداقل موجودی</span>
            <b>${this.numberFormat(min)}</b>
          </div>
        </article>
      `;
    })
    .join("");
},

renderSummary() {
  const items = this.read();

  const totalKinds = items.length;
  const totalQty = items.reduce(
    (sum, item) => sum + this.number(item.qty),
    0
  );
  const lowStock = items.filter(
    item => this.number(item.qty) <= this.number(item.min)
  ).length;

  const movements = this.movements();
  const today = this.fileDate();

  const todayIn = movements
    .filter(m =>
      m.type === "in" &&
      String(m.createdAt || "").startsWith(today)
    )
    .reduce((sum, m) => sum + this.number(m.quantity), 0);

  const todayOut = movements
    .filter(m =>
      m.type === "out" &&
      String(m.createdAt || "").startsWith(today)
    )
    .reduce((sum, m) => sum + this.number(m.quantity), 0);

  const values = {
    totalKinds,
    totalQty,
    lowStock,
    todayIn,
    todayOut
  };

  Object.entries(values).forEach(([key, value]) => {
    document.querySelectorAll(
      `[data-warehouse-summary="${key}"]`
    ).forEach(el => {
      el.textContent = this.numberFormat(value);
    });
  });
},

refresh() {
  this.render();
  this.renderSummary();
  this.renderCategories();

  document.dispatchEvent(
    new CustomEvent("tipax:warehouse-updated", {
      detail: {
        items: this.read(),
        movements: this.movements()
      }
    })
  );
},

renderCategories() {
  const select =
    document.querySelector(
      "[data-warehouse-category]"
    );

  if (!select) return;

  const current = select.value || "all";

  const categories = [
    ...new Set(
      this.read()
        .map(item => item.category)
        .filter(Boolean)
    )
  ];

  select.innerHTML =
    `<option value="all">همه دسته‌ها</option>` +
    categories
      .map(
        category =>
          `<option value="${this.escape(category)}">
            ${this.escape(category)}
          </option>`
      )
      .join("");

  select.value =
    categories.includes(current)
      ? current
      : "all";
},

reset() {
  const confirmed = window.confirm(
    "آیا می‌خواهید موجودی انبار به مقادیر اولیه صفر برگردد؟"
  );

  if (!confirmed) return;

  const items = this.read().map(item => ({
    ...item,
    qty: 0,
    updatedAt: new Date().toISOString()
  }));

  if (this.write(items)) {
    this.refresh();
    this.notify(
      "موجودی انبار صفر شد.",
      "success"
    );
  }
},

exportCsv() {
  const items = this.read();

  if (!items.length) {
    this.notify(
      "اطلاعاتی برای خروجی وجود ندارد.",
      "error"
    );
    return;
  }

  const rows = [
    [
      "کد",
      "نام قلم",
      "دسته",
      "واحد",
      "موجودی",
      "حداقل موجودی",
      "وضعیت"
    ],
    ...items.map(item => [
      item.id,
      item.name,
      item.category,
      item.unit,
      item.qty,
      item.min,
      this.number(item.qty) <= this.number(item.min)
        ? "موجودی کم"
        : "موجود"
    ])
  ];

  const csv = rows
    .map(row =>
      row
        .map(value => this.csvCell(value))
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob(
    ["\uFEFF" + csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download =
    `tipax-warehouse-${this.fileDate()}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  this.notify(
    "خروجی انبار آماده شد.",
    "success"
  );
},

csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
},

fileDate() {
  const d = new Date();

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
},

number(value) {
  const n = Number(
    String(value ?? "")
      .replace(/,/g, "")
      .replace(/٬/g, "")
      .replace(/[^\d.-]/g, "")
  );

  return Number.isFinite(n) ? n : 0;
},

numberFormat(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(this.number(value));
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
  }, 2600);
},

toastTimer: null

};

window.TipaxWarehouse = Warehouse;

window.refreshWarehouse = () =>
Warehouse.refresh();

window.exportWarehouse = () =>
Warehouse.exportCsv();

window.resetWarehouse = () =>
Warehouse.reset();

if (document.readyState === "loading") {
document.addEventListener(
"DOMContentLoaded",
() => Warehouse.init(),
{ once: true }
);
} else {
Warehouse.init();
}
})();
