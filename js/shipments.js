(() => {
"use strict";

const Shipments = {
initialized: false,
storageKey: "tipax_shipments",
state: {
shipments: [],
filtered: [],
page: 1,
pageSize: 10,
search: "",
status: "all",
payment: "all",
sort: "newest"
},

init() {
  if (this.initialized) return;
  this.initialized = true;

  this.load();
  this.bindEvents();
  this.render();
  this.updateSummary();
},

load() {
  try {
    const raw = localStorage.getItem(this.storageKey);
    const data = raw ? JSON.parse(raw) : [];

    this.state.shipments = Array.isArray(data)
      ? data.map(item => this.normalize(item))
      : [];
  } catch {
    this.state.shipments = [];
  }
},

save() {
  try {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.state.shipments)
    );
    return true;
  } catch {
    return false;
  }
},

normalize(item = {}) {
  return {
    id: String(item.id || this.createId()),
    trackingCode: String(item.trackingCode || item.tracking || ""),
    customer: String(item.customer || item.sender || ""),
    receiver: String(item.receiver || ""),
    phone: String(item.phone || ""),
    destination: String(item.destination || ""),
    service: String(item.service || "عادی"),
    payment: String(item.payment || "نقدی"),
    amount: this.toNumber(item.amount),
    status: String(item.status || "ثبت شده"),
    carton: String(item.carton || ""),
    weight: this.toNumber(item.weight),
    courier: String(item.courier || ""),
    routeError: Boolean(item.routeError),
    note: String(item.note || ""),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  };
},

createId() {
  if (window.crypto?.randomUUID) return crypto.randomUUID();

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
},

bindEvents() {
  document.addEventListener("input", event => {
    const input = event.target.closest(
      "[data-shipment-search], #shipmentSearch"
    );

    if (!input) return;

    this.state.search = String(input.value || "")
      .trim()
      .toLocaleLowerCase("fa");

    this.state.page = 1;
    this.render();
  });

  document.addEventListener("change", event => {
    const status = event.target.closest(
      "[data-shipment-status-filter], #shipmentStatusFilter"
    );

    if (status) {
      this.state.status = status.value || "all";
      this.state.page = 1;
      this.render();
      return;
    }

    const payment = event.target.closest(
      "[data-shipment-payment-filter], #shipmentPaymentFilter"
    );

    if (payment) {
      this.state.payment = payment.value || "all";
      this.state.page = 1;
      this.render();
      return;
    }

    const pageSize = event.target.closest(
      "[data-shipment-page-size]"
    );

    if (pageSize) {
      this.state.pageSize = Math.max(
        1,
        this.toNumber(pageSize.value) || 10
      );
      this.state.page = 1;
      this.render();
    }
  });

  document.addEventListener("click", event => {
    const button = event.target.closest(
      "[data-shipment-status]"
    );

    if (button) {
      event.preventDefault();

      this.state.status =
        button.getAttribute("data-shipment-status") || "all";

      this.state.page = 1;
      this.render();
      return;
    }

    const sort = event.target.closest(
      "[data-shipment-sort]"
    );

    if (sort) {
      event.preventDefault();

      this.state.sort =
        sort.getAttribute("data-shipment-sort") || "newest";

      this.render();
      return;
    }

    const page = event.target.closest(
      "[data-shipment-page]"
    );

    if (page) {
      event.preventDefault();

      const value = page.getAttribute("data-shipment-page");

      if (value === "next") {
        this.nextPage();
      } else if (value === "prev") {
        this.previousPage();
      } else {
        this.goToPage(this.toNumber(value));
      }

      return;
    }

    const action = event.target.closest(
      "[data-shipment-action]"
    );

    if (action) {
      event.preventDefault();
      this.handleAction(action);
    }
  });

  document.addEventListener("submit", event => {
    const form = event.target.closest(
      "#shipmentForm, [data-shipment-form]"
    );

    if (!form) return;

    event.preventDefault();
    this.handleFormSubmit(form);
  });
},

handleAction(element) {
  const action = element.getAttribute("data-shipment-action");
  const id = element.getAttribute("data-shipment-id");

  if (!action) return;

  if (action === "delete" && id) {
    this.delete(id);
    return;
  }

  if (action === "return" && id) {
    this.updateStatus(id, "عودت");
    return;
  }

  if (action === "close" && id) {
    this.updateStatus(id, "مختومه");
    return;
  }

  if (action === "deliver" && id) {
    this.updateStatus(id, "تحویل شده");
    return;
  }

  if (action === "pending" && id) {
    this.updateStatus(id, "در انتظار");
    return;
  }

  if (action === "edit" && id) {
    this.openEdit(id);
    return;
  }

  if (action === "view" && id) {
    this.openDetails(id);
  }
},

handleFormSubmit(form) {
  const formData = new FormData(form);
  const id = String(formData.get("id") || "").trim();

  const record = this.normalize({
    id: id || this.createId(),
    trackingCode: formData.get("trackingCode"),
    customer: formData.get("customer"),
    receiver: formData.get("receiver"),
    phone: formData.get("phone"),
    destination: formData.get("destination"),
    service: formData.get("service"),
    payment: formData.get("payment"),
    amount: formData.get("amount"),
    status: formData.get("status") || "ثبت شده",
    carton: formData.get("carton"),
    weight: formData.get("weight"),
    courier: formData.get("courier"),
    routeError: formData.get("routeError"),
    note: formData.get("note"),
    createdAt: id
      ? this.find(id)?.createdAt
      : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  if (!record.trackingCode && !record.customer && !record.receiver) {
    this.notify("حداقل اطلاعات مرسوله را وارد کنید.", "error");
    return;
  }

  if (id && this.find(id)) {
    this.state.shipments = this.state.shipments.map(item =>
      item.id === id ? record : item
    );
  } else {
    this.state.shipments.unshift(record);
  }

  this.save();
  this.state.page = 1;
  this.render();
  this.updateSummary();

  form.reset();
  form.querySelector('[name="id"]')?.remove();

  this.notify(
    id ? "اطلاعات مرسوله ویرایش شد." : "مرسوله با موفقیت ثبت شد.",
    "success"
  );

  document.dispatchEvent(
    new CustomEvent("tipax:shipment-saved", {
      detail: record
    })
  );
},

add(data) {
  const record = this.normalize(data);

  this.state.shipments.unshift(record);
  this.save();
  this.render();
  this.updateSummary();

  return record;
},

update(id, changes = {}) {
  const index = this.state.shipments.findIndex(
    item => item.id === String(id)
  );

  if (index === -1) return null;

  this.state.shipments[index] = this.normalize({
    ...this.state.shipments[index],
    ...changes,
    id: this.state.shipments[index].id,
    updatedAt: new Date().toISOString()
  });

  this.save();
  this.render();
  this.updateSummary();

  return this.state.shipments[index];
},

updateStatus(id, status) {
  const record = this.update(id, { status });

  if (!record) return;

  this.notify(
    `وضعیت مرسوله به «${status}» تغییر کرد.`,
    "success"
  );

  document.dispatchEvent(
    new CustomEvent("tipax:shipment-status-changed", {
      detail: record
    })
  );
},

delete(id) {
  const record = this.find(id);
  if (!record) return;

  const confirmMessage =
    "آیا از حذف این مرسوله مطمئن هستید؟";

  if (!window.confirm(confirmMessage)) return;

  this.state.shipments = this.state.shipments.filter(
    item => item.id !== String(id)
  );

  this.save();

  const maxPage = Math.max(
    1,
    Math.ceil(
      this.getFiltered().length / this.state.pageSize
    )
  );

  this.state.page = Math.min(this.state.page, maxPage);

  this.render();
  this.updateSummary();

  this.notify("مرسوله حذف شد.", "success");

  document.dispatchEvent(
    new CustomEvent("tipax:shipment-deleted", {
      detail: record
    })
  );
},

find(id) {
  return this.state.shipments.find(
    item => item.id === String(id)
  ) || null;
},

openEdit(id) {
  const record = this.find(id);
  if (!record) return;

  const target =
    document.querySelector("[data-shipment-edit]");

  if (target) {
    Object.entries(record).forEach(([key, value]) => {
      const input = target.querySelector(`[name="${key}"]`);

      if (!input) return;

      if (input.type === "checkbox") {
        input.checked = Boolean(value);
      } else {
        input.value = value;
      }
    });

    let hidden = target.querySelector('[name="id"]');

    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "id";
      target.appendChild(hidden);
    }

    hidden.value = record.id;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    return;
  }

  const params = new URLSearchParams({
    id: record.id
  });

  window.location.href =
    `register.html?${params.toString()}`;
},

openDetails(id) {
  const record = this.find(id);
  if (!record) return;

  document.querySelectorAll(
    "[data-shipment-detail]"
  ).forEach(element => {
    element.textContent = "";
    element.hidden = false;

    Object.entries(record).forEach(([key, value]) => {
      const target = element.querySelector(
        `[data-detail="${key}"]`
      );

      if (target) {
        target.textContent =
          key === "amount"
            ? this.formatMoney(value)
            : String(value ?? "—");
      }
    });
  });

  const event = new CustomEvent(
    "tipax:shipment-view",
    { detail: record }
  );

  document.dispatchEvent(event);
},

getFiltered() {
  const query = this.state.search;
  const status = this.state.status;
  const payment = this.state.payment;

  let list = this.state.shipments.filter(item => {
    const searchable = [
      item.id,
      item.trackingCode,
      item.customer,
      item.receiver,
      item.phone,
      item.destination,
      item.service,
      item.payment,
      item.status,
      item.courier,
      item.note
    ]
      .join(" ")
      .toLocaleLowerCase("fa");

    const matchesSearch =
      !query || searchable.includes(query);

    const matchesStatus =
      status === "all" ||
      !status ||
      item.status === status;

    const matchesPayment =
      payment === "all" ||
      !payment ||
      item.payment === payment;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPayment
    );
  });

  list.sort((a, b) => {
    if (this.state.sort === "oldest") {
      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );
    }

    if (this.state.sort === "amount-high") {
      return b.amount - a.amount;
    }

    if (this.state.sort === "amount-low") {
      return a.amount - b.amount;
    }

    return (
      new Date(b.createdAt) -
      new Date(a.createdAt)
    );
  });

  return list;
},

render() {
  const filtered = this.getFiltered();
  this.state.filtered = filtered;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length / this.state.pageSize
    )
  );

  this.state.page = Math.min(
    Math.max(this.state.page, 1),
    totalPages
  );

  const start =
    (this.state.page - 1) *
    this.state.pageSize;

  const rows = filtered.slice(
    start,
    start + this.state.pageSize
  );

  this.renderRows(rows);
  this.renderEmpty(filtered.length === 0);
  this.renderPagination(
    filtered.length,
    totalPages
  );
  this.renderResultCount(filtered.length);
},

renderRows(rows) {
  const container =
    document.querySelector(
      "[data-shipments-list], #shipmentsList, tbody[data-shipments]"
    );

  if (!container) return;

  const isTableBody =
    container.tagName === "TBODY";

  if (!rows.length) {
    container.innerHTML = "";
    return;
  }

  if (isTableBody) {
    container.innerHTML = rows
      .map(item => this.rowHtml(item))
      .join("");
  } else {
    container.innerHTML = rows
      .map(item => this.cardHtml(item))
      .join("");
  }
},

rowHtml(item) {
  return `
    <tr data-shipment-row="${this.escape(item.id)}">
      <td>${this.escape(item.trackingCode || "—")}</td>
      <td>${this.escape(item.customer || "—")}</td>
      <td>${this.escape(item.receiver || "—")}</td>
      <td>${this.escape(item.destination || "—")}</td>
      <td>${this.escape(item.payment || "—")}</td>
      <td>${this.formatMoney(item.amount)}</td>
      <td>
        <span class="shipment-status status-${this.statusClass(item.status)}">
          ${this.escape(item.status)}
        </span>
      </td>
      <td>
        <div class="shipment-actions">
          <button type="button"
            data-shipment-action="view"
            data-shipment-id="${this.escape(item.id)}">
            مشاهده
          </button>
          <button type="button"
            data-shipment-action="edit"
            data-shipment-id="${this.escape(item.id)}">
            ویرایش
          </button>
          <button type="button"
            data-shipment-action="delete"
            data-shipment-id="${this.escape(item.id)}">
            حذف
          </button>
        </div>
      </td>
    </tr>
  `;
},

cardHtml(item) {
  return `
    <article class="shipment-card"
      data-shipment-row="${this.escape(item.id)}">
      <div class="shipment-card-head">
        <strong>${this.escape(item.trackingCode || "بدون کد")}</strong>
        <span class="shipment-status status-${this.statusClass(item.status)}">
          ${this.escape(item.status)}
        </span>
      </div>

      <div class="shipment-card-grid">
        <div>
          <small>فرستنده</small>
          <span>${this.escape(item.customer || "—")}</span>
        </div>
        <div>
          <small>گیرنده</small>
          <span>${this.escape(item.receiver || "—")}</span>
        </div>
        <div>
          <small>مقصد</small>
          <span>${this.escape(item.destination || "—")}</span>
        </div>
        <div>
          <small>مبلغ</small>
          <span>${this.formatMoney(item.amount)}</span>
        </div>
      </div>

      <div class="shipment-actions">
        <button type="button"
          data-shipment-action="view"
          data-shipment-id="${this.escape(item.id)}">
          مشاهده
        </button>
        <button type="button"
          data-shipment-action="edit"
          data-shipment-id="${this.escape(item.id)}">
          ویرایش
        </button>
        <button type="button"
          data-shipment-action="delete"
          data-shipment-id="${this.escape(item.id)}">
          حذف
        </button>
      </div>
    </article>
  `;
},

renderEmpty(empty) {
  document.querySelectorAll(
    "[data-shipments-empty]"
  ).forEach(element => {
    element.hidden = !empty;
  });
},

renderResultCount(count) {
  document.querySelectorAll(
    "[data-shipments-count]"
  ).forEach(element => {
    element.textContent =
      this.formatNumber(count);
  });
},

renderPagination(count, totalPages) {
  document.querySelectorAll(
    "[data-shipment-current-page]"
  ).forEach(element => {
    element.textContent =
      this.formatNumber(this.state.page);
  });

  document.querySelectorAll(
    "[data-shipment-total-pages]"
  ).forEach(element => {
    element.textContent =
      this.formatNumber(totalPages);
  });

  document.querySelectorAll(
    '[data-shipment-page="prev"]'
  ).forEach(element => {
    element.disabled = this.state.page <= 1;
  });

  document.querySelectorAll(
    '[data-shipment-page="next"]'
  ).forEach(element => {
    element.disabled =
      this.state.page >= totalPages;
  });

  document.querySelectorAll(
    "[data-shipment-page-number]"
  ).forEach(element => {
    const page =
      this.toNumber(
        element.getAttribute(
          "data-shipment-page-number"
        )
      );

    element.classList.toggle(
      "active",
      page === this.state.page
    );
  });
},

updateSummary() {
  const all = this.state.shipments;

  const summary = {
    total: all.length,
    delivered: all.filter(
      item => item.status === "تحویل شده"
    ).length,
    returned: all.filter(
      item => item.status === "عودت"
    ).length,
    closed: all.filter(
      item => item.status === "مختومه"
    ).length,
    pending: all.filter(
      item =>
        item.status === "در انتظار" ||
        item.status === "ثبت شده"
    ).length,
    cash: all.filter(
      item => item.payment === "نقدی"
    ).reduce(
      (sum, item) => sum + item.amount,
      0
    ),
    postpaid: all.filter(
      item => item.payment === "پس کرایه"
    ).reduce(
      (sum, item) => sum + item.amount,
      0
    ),
    totalAmount: all.reduce(
      (sum, item) => sum + item.amount,
      0
    )
  };

  const values = {
    total: summary.total,
    shipments: summary.total,
    delivered: summary.delivered,
    returned: summary.returned,
    closed: summary.closed,
    pending: summary.pending,
    cash: summary.cash,
    postpaid: summary.postpaid,
    totalAmount: summary.totalAmount
  };

  Object.entries(values).forEach(([key, value]) => {
    document.querySelectorAll(
      `[data-shipments-summary="${key}"]`
    ).forEach(element => {
      element.textContent =
        key === "cash" ||
        key === "postpaid" ||
        key === "totalAmount"
          ? this.formatMoney(value)
          : this.formatNumber(value);
    });
  });

  document.dispatchEvent(
    new CustomEvent("tipax:shipments-summary", {
      detail: summary
    })
  );
},

goToPage(page) {
  const totalPages = Math.max(
    1,
    Math.ceil(
      this.getFiltered().length /
      this.state.pageSize
    )
  );

  this.state.page = this.clamp(
    this.toNumber(page),
    1,
    totalPages
  );

  this.render();
},

nextPage() {
  this.goToPage(this.state.page + 1);
},

previousPage() {
  this.goToPage(this.state.page - 1);
},

statusClass(status) {
  const map = {
    "تحویل شده": "delivered",
    "عودت": "returned",
    "مختومه": "closed",
    "در انتظار": "pending",
    "ثبت شده": "registered"
  };

  return map[status] || "default";
},

formatMoney(value) {
  return `${this.formatNumber(value)} تومان`;
},

formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(this.toNumber(value));
},

toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = String(value ?? "")
    .replace(/,/g, "")
    .replace(/٬/g, "")
    .replace(/[^\d.-]/g, "");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
},

clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
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
  if (
    window.Tipax &&
    typeof window.Tipax.toast === "function"
  ) {
    window.Tipax.toast(message, type);
    return;
  }

  if (
    window.TipaxApp &&
    typeof window.TipaxApp.toast === "function"
  ) {
    window.TipaxApp.toast(message, type);
    return;
  }

  console.log(`[Tipax] ${message}`);
}

};

window.TipaxShipments = Shipments;

if (document.readyState === "loading") {
document.addEventListener(
"DOMContentLoaded",
() => Shipments.init(),
{ once: true }
);
} else {
Shipments.init();
}
})();
