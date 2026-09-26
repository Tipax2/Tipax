(() => {
"use strict";

const Reports = {
initialized: false,
state: {
from: "",
to: "",
status: "all",
payment: "all",
search: "",
courier: "all",
sort: "newest"
},

keys: [
  "tipax-manual-shipments",
  "tipax_shipments"
],

init() {
  if (this.initialized) return;
  this.initialized = true;

  this.bindEvents();
  this.loadFiltersFromUrl();
  this.refresh();
},

bindEvents() {
  document.addEventListener("submit", event => {
    const form = event.target.closest(
      "[data-report-filter-form], #reportFilterForm"
    );

    if (!form) return;

    event.preventDefault();
    this.readFilters(form);
    this.refresh();
  });

  document.addEventListener("input", event => {
    const field = event.target.closest(
      "[data-report-search], #reportSearch"
    );

    if (!field) return;

    this.state.search = String(field.value || "")
      .trim()
      .toLocaleLowerCase("fa");

    this.refresh(false);
  });

  document.addEventListener("change", event => {
    const field = event.target.closest(
      "[data-report-filter]"
    );

    if (!field) return;

    const key = field.getAttribute(
      "data-report-filter"
    );

    if (!key) return;

    this.state[key] = field.value || "all";
    this.refresh(false);
  });

  document.addEventListener("click", event => {
    const action = event.target.closest(
      "[data-report-action]"
    );

    if (!action) return;

    event.preventDefault();

    const type =
      action.getAttribute("data-report-action");

    if (type === "refresh") {
      this.refresh();
    }

    if (type === "reset") {
      this.reset();
    }

    if (type === "print") {
      this.print();
    }

    if (type === "export") {
      this.exportCsv();
    }

    if (type === "sort") {
      this.state.sort =
        action.getAttribute("data-sort") ||
        "newest";

      this.refresh(false);
    }
  });

  window.addEventListener("storage", event => {
    if (
      this.keys.includes(event.key) ||
      event.key === "tipax_shipments"
    ) {
      this.refresh(false);
    }
  });
},

loadFiltersFromUrl() {
  const params =
    new URLSearchParams(window.location.search);

  [
    "from",
    "to",
    "status",
    "payment",
    "courier",
    "search"
  ].forEach(key => {
    const value = params.get(key);

    if (value !== null) {
      this.state[key] =
        key === "status" ||
        key === "payment" ||
        key === "courier"
          ? value
          : value;
    }
  });

  this.syncFilterInputs();
},

readFilters(form) {
  const data = new FormData(form);

  [
    "from",
    "to",
    "status",
    "payment",
    "courier"
  ].forEach(key => {
    const value = data.get(key);

    if (value !== null) {
      this.state[key] =
        String(value).trim() || "all";
    }
  });

  const search =
    form.querySelector(
      "[name='search'], [data-report-search]"
    );

  if (search) {
    this.state.search = String(
      search.value || ""
    )
      .trim()
      .toLocaleLowerCase("fa");
  }

  this.syncFilterInputs();
},

syncFilterInputs() {
  Object.entries(this.state).forEach(
    ([key, value]) => {
      document.querySelectorAll(
        `[data-report-filter="${key}"]`
      ).forEach(input => {
        input.value = value;
      });
    }
  );

  document.querySelectorAll(
    "[data-report-search], #reportSearch"
  ).forEach(input => {
    input.value = this.state.search;
  });
},

readShipments() {
  const merged = [];
  const seen = new Set();

  this.keys.forEach(key => {
    try {
      const raw =
        localStorage.getItem(key);

      if (!raw) return;

      const data = JSON.parse(raw);

      if (!Array.isArray(data)) return;

      data.forEach(item => {
        const record =
          this.normalize(item);

        const identity =
          record.id ||
          record.trackingCode ||
          JSON.stringify(record);

        if (seen.has(identity)) return;

        seen.add(identity);
        merged.push(record);
      });
    } catch {}
  });

  return merged;
},

normalize(item = {}) {
  return {
    id: String(
      item.id ||
      item.barcode ||
      item.trackingCode ||
      ""
    ),

    trackingCode: String(
      item.trackingCode ||
      item.barcode ||
      item.tracking ||
      ""
    ),

    sender: String(
      item.sender ||
      item.customer ||
      ""
    ),

    receiver: String(
      item.receiver || ""
    ),

    phone: String(
      item.receiverPhone ||
      item.phone ||
      ""
    ),

    province: String(
      item.province || ""
    ),

    destination: String(
      item.dest ||
      item.destination ||
      ""
    ),

    service: String(
      item.service || ""
    ),

    payment: String(
      item.payment ||
      item.paymentStatus ||
      "نقدی"
    ),

    paymentStatus: String(
      item.paymentStatus || ""
    ),

    amount: this.number(
      item.amount
    ),

    weight: this.number(
      item.weight
    ),

    packageCount: Math.max(
      1,
      this.number(
        item.packageCount
      ) || 1
    ),

    box: String(
      item.box ||
      item.carton ||
      ""
    ),

    content: String(
      item.content || ""
    ),

    courier: String(
      item.courier ||
      item.vehicle ||
      ""
    ),

    status: String(
      item.status ||
      "ثبت شده"
    ),

    handed: String(
      item.handed || ""
    ),

    routeError:
      item.routeError === true ||
      item.routeError === "بله",

    notes: String(
      item.notes ||
      item.note ||
      ""
    ),

    date: String(
      item.date || ""
    ),

    createdAt:
      item.createdAt ||
      item.updatedAt ||
      new Date().toISOString(),

    updatedAt:
      item.updatedAt ||
      item.createdAt ||
      new Date().toISOString()
  };
},

getFiltered() {
  let records =
    this.readShipments();

  const search =
    this.state.search;

  records = records.filter(
    record => {
      if (
        this.state.status !== "all" &&
        this.state.status &&
        record.status !==
          this.state.status
      ) {
        return false;
      }

      if (
        this.state.payment !== "all" &&
        this.state.payment &&
        record.payment !==
          this.state.payment
      ) {
        return false;
      }

      if (
        this.state.courier !== "all" &&
        this.state.courier &&
        record.courier !==
          this.state.courier
      ) {
        return false;
      }

      if (
        this.state.from &&
        !this.isDateAtLeast(
          record,
          this.state.from
        )
      ) {
        return false;
      }

      if (
        this.state.to &&
        !this.isDateAtMost(
          record,
          this.state.to
        )
      ) {
        return false;
      }

      if (search) {
        const haystack = [
          record.id,
          record.trackingCode,
          record.sender,
          record.receiver,
          record.phone,
          record.province,
          record.destination,
          record.service,
          record.payment,
          record.status,
          record.courier,
          record.box,
          record.content,
          record.notes
        ]
          .join(" ")
          .toLocaleLowerCase("fa");

        if (!haystack.includes(search)) {
          return false;
        }
      }

      return true;
    }
  );

  records.sort(
    (a, b) => {
      if (
        this.state.sort ===
        "amount-high"
      ) {
        return b.amount - a.amount;
      }

      if (
        this.state.sort ===
        "amount-low"
      ) {
        return a.amount - b.amount;
      }

      if (
        this.state.sort ===
        "oldest"
      ) {
        return (
          this.dateValue(a) -
          this.dateValue(b)
        );
      }

      return (
        this.dateValue(b) -
        this.dateValue(a)
      );
    }
  );

  return records;
},

calculate(records) {
  const total =
    records.length;

  const delivered =
    records.filter(
      item =>
        item.status ===
        "تحویل شده"
    ).length;

  const returned =
    records.filter(
      item =>
        item.status === "عودت"
    ).length;

  const closed =
    records.filter(
      item =>
        item.status === "مختومه"
    ).length;

  const pending =
    records.filter(
      item =>
        item.status ===
          "در انتظار" ||
        item.status ===
          "ثبت شده"
    ).length;

  const routeErrors =
    records.filter(
      item => item.routeError
    ).length;

  const cash =
    records.filter(
      item =>
        item.payment ===
        "نقدی"
    );

  const postpaid =
    records.filter(
      item =>
        item.payment ===
        "پس کرایه"
    );

  const totalAmount =
    records.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const cashAmount =
    cash.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const postpaidAmount =
    postpaid.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const deliveredAmount =
    records
      .filter(
        item =>
          item.status ===
          "تحویل شده"
      )
      .reduce(
        (sum, item) =>
          sum + item.amount,
        0
      );

  const averageAmount =
    total
      ? totalAmount / total
      : 0;

  const deliveryRate =
    total
      ? (delivered / total) *
        100
      : 0;

  const returnRate =
    total
      ? (returned / total) *
        100
      : 0;

  return {
    total,
    delivered,
    returned,
    closed,
    pending,
    routeErrors,
    cashCount: cash.length,
    postpaidCount:
      postpaid.length,
    totalAmount,
    cashAmount,
    postpaidAmount,
    deliveredAmount,
    averageAmount,
    deliveryRate,
    returnRate
  };
},

renderSummary(summary) {
  const values = {
    total: summary.total,
    shipments: summary.total,
    delivered:
      summary.delivered,
    returned:
      summary.returned,
    closed:
      summary.closed,
    pending:
      summary.pending,
    routeErrors:
      summary.routeErrors,
    cashCount:
      summary.cashCount,
    postpaidCount:
      summary.postpaidCount,
    totalAmount:
      summary.totalAmount,
    cashAmount:
      summary.cashAmount,
    postpaidAmount:
      summary.postpaidAmount,
    deliveredAmount:
      summary.deliveredAmount,
    averageAmount:
      summary.averageAmount,
    deliveryRate:
      `${this.percent(
        summary.deliveryRate
      )}%`,
    returnRate:
      `${this.percent(
        summary.returnRate
      )}%`
  };

  Object.entries(values).forEach(
    ([key, value]) => {
      document.querySelectorAll(
        `[data-report-summary="${key}"]`
      ).forEach(element => {
        element.textContent =
          key.includes("Amount") ||
          key === "averageAmount"
            ? this.money(value)
            : value;
      });
    }
  );

  document.querySelectorAll(
    "[data-report-total]"
  ).forEach(element => {
    element.textContent =
      this.numberFormat(
        summary.total
      );
  });
},

renderTable(records) {
  const body =
    document.querySelector(
      "[data-report-list], #reportList, tbody[data-reports]"
    );

  if (!body) return;

  if (!records.length) {
    body.innerHTML = "";
    return;
  }

  if (body.tagName === "TBODY") {
    body.innerHTML =
      records
        .map(
          record =>
            this.tableRow(record)
        )
        .join("");
  } else {
    body.innerHTML =
      records
        .map(
          record =>
            this.card(record)
        )
        .join("");
  }
},

tableRow(record) {
  return `
    <tr data-report-id="${this.escape(
      record.id
    )}">
      <td>${this.escape(
        record.trackingCode || "—"
      )}</td>
      <td>${this.escape(
        record.sender || "—"
      )}</td>
      <td>${this.escape(
        record.receiver || "—"
      )}</td>
      <td>${this.escape(
        record.destination || "—"
      )}</td>
      <td>${this.escape(
        record.payment || "—"
      )}</td>
      <td>${this.money(
        record.amount
      )}</td>
      <td>
        <span class="report-status status-${this.statusClass(
          record.status
        )}">
          ${this.escape(
            record.status
          )}
        </span>
      </td>
      <td>${this.escape(
        record.courier || "—"
      )}</td>
    </tr>
  `;
},

card(record) {
  return `
    <article
      class="report-card"
      data-report-id="${this.escape(
        record.id
      )}"
    >
      <div class="report-card-head">
        <strong>
          ${this.escape(
            record.trackingCode ||
            "بدون کد"
          )}
        </strong>

        <span class="report-status status-${this.statusClass(
          record.status
        )}">
          ${this.escape(
            record.status
          )}
        </span>
      </div>

      <div class="report-card-grid">
        <div>
          <small>فرستنده</small>
          <b>${this.escape(
            record.sender ||
            "—"
          )}</b>
        </div>

        <div>
          <small>گیرنده</small>
          <b>${this.escape(
            record.receiver ||
            "—"
          )}</b>
        </div>

        <div>
          <small>مقصد</small>
          <b>${this.escape(
            record.destination ||
            "—"
          )}</b>
        </div>

        <div>
          <small>مبلغ</small>
          <b>${this.money(
            record.amount
          )}</b>
        </div>
      </div>
    </article>
  `;
},

renderEmpty(empty) {
  document.querySelectorAll(
    "[data-report-empty]"
  ).forEach(element => {
    element.hidden = !empty;
  });
},

renderDateInfo(records) {
  const dates =
    records
      .map(item =>
        this.dateValue(item)
      )
      .filter(Boolean);

  if (!dates.length) return;

  const min =
    new Date(
      Math.min(...dates)
    );

  const max =
    new Date(
      Math.max(...dates)
    );

  const values = {
    first:
      this.formatDate(min),
    last:
      this.formatDate(max)
  };

  Object.entries(values).forEach(
    ([key, value]) => {
      document.querySelectorAll(
        `[data-report-date="${key}"]`
      ).forEach(element => {
        element.textContent =
          value;
      });
    }
  );
},

renderBreakdown(records) {
  const statuses = {};
  const payments = {};
  const couriers = {};
  const boxes = {};

  records.forEach(item => {
    statuses[item.status] =
      (statuses[item.status] || 0) + 1;

    payments[item.payment] =
      (payments[item.payment] || 0) + 1;

    if (item.courier) {
      couriers[item.courier] =
        (couriers[item.courier] || 0) +
        1;
    }

    if (item.box) {
      boxes[item.box] =
        (boxes[item.box] || 0) +
        item.packageCount;
    }
  });

  this.renderObjectList(
    "[data-report-status-breakdown]",
    statuses
  );

  this.renderObjectList(
    "[data-report-payment-breakdown]",
    payments
  );

  this.renderObjectList(
    "[data-report-courier-breakdown]",
    couriers
  );

  this.renderObjectList(
    "[data-report-box-breakdown]",
    boxes
  );
},

renderObjectList(selector, data) {
  document.querySelectorAll(
    selector
  ).forEach(container => {
    const entries =
      Object.entries(data)
        .sort(
          (a, b) =>
            b[1] - a[1]
        );

    if (!entries.length) {
      container.innerHTML =
        "<span>اطلاعاتی موجود نیست</span>";
      return;
    }

    container.innerHTML =
      entries
        .map(
          ([key, value]) => `
            <div class="report-breakdown-item">
              <span>${this.escape(
                key
              )}</span>
              <b>${this.numberFormat(
                value
              )}</b>
            </div>
          `
        )
        .join("");
  });
},

render() {
  const records =
    this.getFiltered();

  const summary =
    this.calculate(records);

  this.renderSummary(summary);
  this.renderTable(records);
  this.renderEmpty(
    records.length === 0
  );
  this.renderDateInfo(records);
  this.renderBreakdown(records);

  this.updateUrl();

  document.dispatchEvent(
    new CustomEvent(
      "tipax:reports-updated",
      {
        detail: {
          records,
          summary,
          filters: {
            ...this.state
          }
        }
      }
    )
  );
},

refresh(scroll = true) {
  this.render();

  if (scroll) {
    document
      .querySelector(
        "[data-report-content]"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  }
},

reset() {
  this.state = {
    from: "",
    to: "",
    status: "all",
    payment: "all",
    search: "",
    courier: "all",
    sort: "newest"
  };

  this.syncFilterInputs();
  this.refresh();

  this.notify(
    "فیلترهای گزارش پاک شدند.",
    "success"
  );
},

updateUrl() {
  if (
    !window.history ||
    !window.history.replaceState
  ) {
    return;
  }

  const params =
    new URLSearchParams();

  Object.entries(this.state)
    .forEach(
      ([key, value]) => {
        if (
          value &&
          value !== "all" &&
          value !== "newest"
        ) {
          params.set(
            key,
            value
          );
        }
      }
    );

  const query =
    params.toString();

  const url =
    `${window.location.pathname}${
      query ? `?${query}` : ""
    }`;

  window.history.replaceState(
    {},
    "",
    url
  );
},

print() {
  window.print();
},

exportCsv() {
  const records =
    this.getFiltered();

  if (!records.length) {
    this.notify(
      "داده‌ای برای خروجی گرفتن وجود ندارد.",
      "error"
    );
    return;
  }

  const headers = [
    "کد مرسوله",
    "فرستنده",
    "گیرنده",
    "شماره تماس",
    "استان",
    "مقصد",
    "سرویس",
    "نوع پرداخت",
    "وضعیت پرداخت",
    "مبلغ",
    "وزن",
    "تعداد بسته",
    "سایز کارتن",
    "محتوا",
    "پخش‌کننده",
    "وضعیت مرسوله",
    "تحویل به پخش‌کننده",
    "اشتباه مسیر",
    "تاریخ",
    "توضیحات"
  ];

  const rows =
    records.map(item => [
      item.trackingCode,
      item.sender,
      item.receiver,
      item.phone,
      item.province,
      item.destination,
      item.service,
      item.payment,
      item.paymentStatus,
      item.amount,
      item.weight,
      item.packageCount,
      item.box,
      item.content,
      item.courier,
      item.status,
      item.handed,
      item.routeError
        ? "بله"
        : "خیر",
      item.date,
      item.notes
    ]);

  const csv = [
    headers,
    ...rows
  ]
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
    `tipax-report-${this.fileDate()}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  this.notify(
    "فایل گزارش آماده شد.",
    "success"
  );
},

csvCell(value) {
  const text =
    String(value ?? "");

  return `"${text.replace(
    /"/g,
    '""'
  )}"`;
},

fileDate() {
  const now =
    new Date();

  const y =
    now.getFullYear();

  const m =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const d =
    String(
      now.getDate()
    ).padStart(2, "0");

  return `${y}-${m}-${d}`;
},

dateValue(record) {
  if (
    record.createdAt &&
    !Number.isNaN(
      Date.parse(
        record.createdAt
      )
    )
  ) {
    return Date.parse(
      record.createdAt
    );
  }

  if (record.date) {
    const parsed =
      Date.parse(
        record.date
      );

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return 0;
},

isDateAtLeast(record, value) {
  const timestamp =
    this.dateValue(record);

  if (!timestamp) return true;

  const target =
    new Date(
      `${value}T00:00:00`
    ).getTime();

  return timestamp >= target;
},

isDateAtMost(record, value) {
  const timestamp =
    this.dateValue(record);

  if (!timestamp) return true;

  const target =
    new Date(
      `${value}T23:59:59`
    ).getTime();

  return timestamp <= target;
},

formatDate(value) {
  if (
    !(value instanceof Date) ||
    Number.isNaN(
      value.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(value);
},

statusClass(status) {
  const map = {
    "تحویل شده": "delivered",
    "عودت": "returned",
    "مختومه": "closed",
    "در انتظار": "pending",
    "ثبت شده": "registered"
  };

  return (
    map[status] ||
    "default"
  );
},

number(value) {
  const normalized =
    String(value ?? "")
      .replace(/,/g, "")
      .replace(/٬/g, "")
      .replace(/[^\d.-]/g, "");

  const number =
    Number(normalized);

  return Number.isFinite(
    number
  )
    ? number
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

money(value) {
  return `${this.numberFormat(
    value
  )} تومان`;
},

percent(value) {
  const rounded =
    Math.round(
      this.number(value) *
        10
    ) / 10;

  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 1
    }
  ).format(
    rounded
  );
},

escape(value) {
  return String(value ?? "")
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
},

toastTimer: null

};

window.TipaxReports = Reports;

window.refreshReports = () =>
Reports.refresh();

window.resetReports = () =>
Reports.reset();

window.exportReports = () =>
Reports.exportCsv();

window.printReports = () =>
Reports.print();

if (
document.readyState ===
"loading"
) {
document.addEventListener(
"DOMContentLoaded",
() => Reports.init(),
{ once: true }
);
} else {
Reports.init();
}
})();
