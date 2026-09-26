(() => {
"use strict";

const Couriers = {
initialized: false,
storageKey: "tipax-couriers",
assignmentKey: "tipax-courier-assignments",
toastTimer: null,

defaults: [
  {
    id: "motor",
    name: "پیک موتور",
    type: "موتور",
    phone: "",
    active: true,
    capacity: 0,
    note: ""
  },
  {
    id: "van",
    name: "پیک وانت",
    type: "وانت",
    phone: "",
    active: true,
    capacity: 0,
    note: ""
  },
  {
    id: "car",
    name: "پیک ماشین",
    type: "ماشین",
    phone: "",
    active: true,
    capacity: 0,
    note: ""
  }
],

init() {
  if (this.initialized) return;
  this.initialized = true;

  this.ensureDefaults();
  this.bindEvents();
  this.refresh();
},

ensureDefaults() {
  const current = this.read();

  if (!current.length) {
    this.write(
      this.defaults.map(item => ({
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    );
  }
},

bindEvents() {
  document.addEventListener("submit", event => {
    const form = event.target.closest(
      "[data-courier-form], #courierForm"
    );

    if (!form) return;

    event.preventDefault();
    this.saveForm(form);
  });

  document.addEventListener("click", event => {
    const action = event.target.closest(
      "[data-courier-action]"
    );

    if (!action) return;

    event.preventDefault();

    const type = action.dataset.courierAction;
    const id = action.dataset.id || "";

    if (type === "refresh") this.refresh();
    if (type === "add") this.openForm();
    if (type === "edit") this.edit(id);
    if (type === "delete") this.remove(id);
    if (type === "toggle") this.toggle(id);
    if (type === "close") this.closeForm();
    if (type === "export") this.exportCsv();
  });

  document.addEventListener("input", event => {
    if (
      event.target.matches(
        "[data-courier-search], #courierSearch"
      )
    ) {
      this.render();
    }
  });

  window.addEventListener("storage", event => {
    if (
      event.key === this.storageKey ||
      event.key === this.assignmentKey ||
      event.key === "tipax-manual-shipments"
    ) {
      this.refresh();
    }
  });
},

read() {
  try {
    const raw = localStorage.getItem(this.storageKey);
    const data = raw ? JSON.parse(raw) : [];

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
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
    this.notify(
      "ذخیره اطلاعات پیک‌ها انجام نشد.",
      "error"
    );
    return false;
  }
},

readAssignments() {
  try {
    const raw =
      localStorage.getItem(
        this.assignmentKey
      );

    const data =
      raw ? JSON.parse(raw) : [];

    return Array.isArray(data)
      ? data
      : [];
  } catch {
    return [];
  }
},

readShipments() {
  try {
    const raw = localStorage.getItem(
      "tipax-manual-shipments"
    );

    const data = raw ? JSON.parse(raw) : [];

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
},

getStats(courier) {
  const shipments =
    this.readShipments();

  const assignments =
    this.readAssignments();

  const courierName =
    String(courier.name || "");

  const courierType =
    String(courier.type || "");

  const related = shipments.filter(item => {
    const value = String(
      item.courier ||
      item.vehicle ||
      ""
    );

    return (
      value === courierName ||
      value === courierType ||
      value === courier.id
    );
  });

  const assigned =
    assignments.filter(item =>
      String(item.courierId) ===
      String(courier.id)
    );

  const delivered =
    related.filter(item =>
      String(item.status) ===
      "تحویل شده"
    ).length;

  const returned =
    related.filter(item =>
      String(item.status) ===
      "عودت"
    ).length;

  const routeErrors =
    related.filter(item =>
      item.routeError === true ||
      item.routeError === "بله"
    ).length;

  const pending =
    related.filter(item =>
      !["تحویل شده", "عودت", "مختومه"]
        .includes(
          String(item.status)
        )
    ).length;

  return {
    total: related.length,
    delivered,
    returned,
    routeErrors,
    pending,
    assigned: assigned.length
  };
},

filtered() {
  const search =
    String(
      document.querySelector(
        "[data-courier-search], #courierSearch"
      )?.value || ""
    )
      .trim()
      .toLocaleLowerCase("fa");

  return this.read().filter(item => {
    if (!search) return true;

    return [
      item.name,
      item.type,
      item.phone,
      item.note
    ]
      .join(" ")
      .toLocaleLowerCase("fa")
      .includes(search);
  });
},

render() {
  const container =
    document.querySelector(
      "[data-courier-list], #courierList"
    );

  if (!container) return;

  const couriers =
    this.filtered();

  if (!couriers.length) {
    container.innerHTML =
      `<div class="empty-state">
        پیک موردی برای نمایش پیدا نشد.
      </div>`;
    return;
  }

  container.innerHTML =
    couriers.map(courier => {
      const stats =
        this.getStats(courier);

      return `
        <article
          class="courier-card ${
            courier.active
              ? "is-active"
              : "is-inactive"
          }"
          data-courier-id="${this.escape(
            courier.id
          )}"
        >
          <div class="courier-card-head">
            <div class="courier-icon">
              ${this.icon(courier.type)}
            </div>

            <div class="courier-title">
              <small>${this.escape(
                courier.type || "پیک"
              )}</small>

              <h3>${this.escape(
                courier.name
              )}</h3>

              ${
                courier.phone
                  ? `<span>${this.escape(
                      courier.phone
                    )}</span>`
                  : ""
              }
            </div>

            <span class="courier-state ${
              courier.active
                ? "online"
                : "offline"
            }">
              ${
                courier.active
                  ? "فعال"
                  : "غیرفعال"
              }
            </span>
          </div>

          <div class="courier-stats">
            <div>
              <small>کل مرسولات</small>
              <b>${this.numberFormat(
                stats.total
              )}</b>
            </div>

            <div>
              <small>تحویل شده</small>
              <b>${this.numberFormat(
                stats.delivered
              )}</b>
            </div>

            <div>
              <small>عودت</small>
              <b>${this.numberFormat(
                stats.returned
              )}</b>
            </div>

            <div>
              <small>اشتباه مسیر</small>
              <b>${this.numberFormat(
                stats.routeErrors
              )}</b>
            </div>
          </div>

          <div class="courier-footer">
            <span>
              در انتظار:
              ${this.numberFormat(
                stats.pending
              )}
            </span>

            <div class="courier-actions">
              <button
                type="button"
                data-courier-action="toggle"
                data-id="${this.escape(
                  courier.id
                )}"
                title="${
                  courier.active
                    ? "غیرفعال کردن"
                    : "فعال کردن"
                }"
              >
                ${courier.active ? "⏸" : "▶"}
              </button>

              <button
                type="button"
                data-courier-action="edit"
                data-id="${this.escape(
                  courier.id
                )}"
                title="ویرایش"
              >
                ✎
              </button>

              <button
                type="button"
                data-courier-action="delete"
                data-id="${this.escape(
                  courier.id
                )}"
                title="حذف"
              >
                ×
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
},

renderSummary() {
  const couriers =
    this.read();

  const active =
    couriers.filter(
      item => item.active
    ).length;

  const inactive =
    couriers.length - active;

  const shipments =
    couriers.reduce(
      (sum, courier) =>
        sum +
        this.getStats(courier).total,
      0
    );

  const delivered =
    couriers.reduce(
      (sum, courier) =>
        sum +
        this.getStats(courier).delivered,
      0
    );

  const values = {
    total: couriers.length,
    active,
    inactive,
    shipments,
    delivered
  };

  Object.entries(values).forEach(
    ([key, value]) => {
      document.querySelectorAll(
        `[data-courier-summary="${key}"]`
      ).forEach(el => {
        el.textContent =
          this.numberFormat(value);
      });
    }
  );
},

openForm(courier = null) {
  const panel =
    document.querySelector(
      "[data-courier-editor], #courierEditor"
    );

  if (!panel) return;

  panel.hidden = false;

  const form =
    panel.querySelector(
      "form"
    );

  if (!form) return;

  form.reset();

  const idField =
    form.querySelector(
      "[name='id']"
    );

  if (idField) {
    idField.value =
      courier?.id || "";
  }

  [
    "name",
    "type",
    "phone",
    "capacity",
    "note"
  ].forEach(name => {
    const field =
      form.querySelector(
        `[name="${name}"]`
      );

    if (field && courier) {
      field.value =
        courier[name] ?? "";
    }
  });

  const active =
    form.querySelector(
      "[name='active']"
    );

  if (active) {
    active.checked =
      courier
        ? courier.active !== false
        : true;
  }

  panel.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
},

closeForm() {
  const panel =
    document.querySelector(
      "[data-courier-editor], #courierEditor"
    );

  if (panel) {
    panel.hidden = true;
  }
},

edit(id) {
  const courier =
    this.read().find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!courier) {
    this.notify(
      "پیک موردنظر پیدا نشد.",
      "error"
    );
    return;
  }

  this.openForm(courier);
},

saveForm(form) {
  const data =
    new FormData(form);

  const id =
    String(
      data.get("id") || ""
    ).trim();

  const name =
    String(
      data.get("name") || ""
    ).trim();

  const type =
    String(
      data.get("type") || ""
    ).trim();

  const phone =
    String(
      data.get("phone") || ""
    ).trim();

  const capacity =
    this.number(
      data.get("capacity")
    );

  const note =
    String(
      data.get("note") || ""
    ).trim();

  const active =
    data.get("active") !== null;

  if (!name || !type) {
    this.notify(
      "نام و نوع پیک را وارد کنید.",
      "error"
    );
    return;
  }

  const couriers =
    this.read();

  if (id) {
    const index =
      couriers.findIndex(
        item =>
          String(item.id) ===
          id
      );

    if (index === -1) {
      this.notify(
        "پیک برای ویرایش پیدا نشد.",
        "error"
      );
      return;
    }

    couriers[index] = {
      ...couriers[index],
      name,
      type,
      phone,
      capacity,
      note,
      active,
      updatedAt:
        new Date().toISOString()
    };
  } else {
    couriers.push({
      id:
        `CO-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
      name,
      type,
      phone,
      capacity,
      note,
      active,
      createdAt:
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString()
    });
  }

  if (!this.write(couriers)) return;

  form.reset();
  this.closeForm();
  this.refresh();

  this.notify(
    id
      ? "اطلاعات پیک ویرایش شد."
      : "پیک جدید ثبت شد.",
    "success"
  );
},

toggle(id) {
  const couriers =
    this.read();

  const index =
    couriers.findIndex(
      item =>
        String(item.id) ===
        String(id)
    );

  if (index === -1) return;

  couriers[index].active =
    !couriers[index].active;

  couriers[index].updatedAt =
    new Date().toISOString();

  if (this.write(couriers)) {
    this.refresh();

    this.notify(
      couriers[index].active
        ? "پیک فعال شد."
        : "پیک غیرفعال شد.",
      "success"
    );
  }
},

remove(id) {
  const courier =
    this.read().find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!courier) return;

  const confirmed =
    window.confirm(
      `پیک «${courier.name}» حذف شود؟`
    );

  if (!confirmed) return;

  const remaining =
    this.read().filter(
      item =>
        String(item.id) !==
        String(id)
    );

  if (this.write(remaining)) {
    this.refresh();

    this.notify(
      "پیک حذف شد.",
      "success"
    );
  }
},

exportCsv() {
  const couriers =
    this.read();

  if (!couriers.length) {
    this.notify(
      "اطلاعاتی برای خروجی وجود ندارد.",
      "error"
    );
    return;
  }

  const rows = [
    [
      "کد",
      "نام پیک",
      "نوع وسیله",
      "شماره تماس",
      "وضعیت",
      "ظرفیت",
      "کل مرسولات",
      "تحویل شده",
      "عودت",
      "اشتباه مسیر",
      "در انتظار",
      "توضیحات"
    ]
  ];

  couriers.forEach(courier => {
    const stats =
      this.getStats(courier);

    rows.push([
      courier.id,
      courier.name,
      courier.type,
      courier.phone,
      courier.active
        ? "فعال"
        : "غیرفعال",
      courier.capacity,
      stats.total,
      stats.delivered,
      stats.returned,
      stats.routeErrors,
      stats.pending,
      courier.note
    ]);
  });

  const csv =
    rows
      .map(row =>
        row
          .map(value =>
            this.csvCell(value)
          )
          .join(",")
      )
      .join("\r\n");

  const blob =
    new Blob(
      ["\uFEFF" + csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    `tipax-couriers-${this.fileDate()}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  this.notify(
    "خروجی پیک‌ها آماده شد.",
    "success"
  );
},

refresh() {
  this.render();
  this.renderSummary();

  this.populateSelectors();

  document.dispatchEvent(
    new CustomEvent(
      "tipax:couriers-updated",
      {
        detail: {
          couriers: this.read()
        }
      }
    )
  );
},

populateSelectors() {
  document.querySelectorAll(
    "[data-courier-selector]"
  ).forEach(select => {
    const current =
      select.value;

    const options =
      this.read()
        .map(
          courier =>
            `<option value="${this.escape(
              courier.id
            )}">
              ${this.escape(
                courier.name
              )}
            </option>`
        )
        .join("");

    select.innerHTML =
      `<option value="">انتخاب پیک</option>` +
      options;

    if (
      this.read().some(
        item =>
          item.id === current
      )
    ) {
      select.value =
        current;
    }
  });
},

icon(type) {
  const icons = {
    موتور: "🏍",
    وانت: "🚐",
    ماشین: "🚗"
  };

  return icons[type] || "🚚";
},

number(value) {
  const n =
    Number(
      String(value ?? "")
        .replace(/,/g, "")
        .replace(/٬/g, "")
        .replace(/[^\d.-]/g, "")
    );

  return Number.isFinite(n)
    ? n
    : 0;
},

numberFormat(value) {
  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 0
    }
  ).format(
    this.number(value)
  );
},

fileDate() {
  const d = new Date();

  return [
    d.getFullYear(),
    String(
      d.getMonth() + 1
    ).padStart(2, "0"),
    String(
      d.getDate()
    ).padStart(2, "0")
  ].join("-");
},

csvCell(value) {
  return `"${String(
    value ?? ""
  ).replace(
    /"/g,
    '""'
  )}"`;
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

notify(message, type = "info") {
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
    setTimeout(() => {
      toast.classList.remove(
        "show"
      );
    }, 2600);
}

};

window.TipaxCouriers =
Couriers;

window.refreshCouriers = () =>
Couriers.refresh();

window.openCourierForm = () =>
Couriers.openForm();

window.exportCouriers = () =>
Couriers.exportCsv();

if (
document.readyState ===
"loading"
) {
document.addEventListener(
"DOMContentLoaded",
() => Couriers.init(),
{ once: true }
);
} else {
Couriers.init();
}
})();
