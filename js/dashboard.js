/* TIPAX SVG PANEL — DASHBOARD CORE
   File: js/dashboard.js
   Version: 1.0.0
*/

(() => {
  "use strict";

  const Dashboard = {
    version: "1.0.0",
    initialized: false,
    refreshTimer: null,
    counterObserver: null,

    state: {
      period: "today",
      data: null,
      searchQuery: ""
    },

    init() {
      if (this.initialized) return;
      this.initialized = true;

      this.state.data = this.loadData();

      this.bindPeriodFilters();
      this.bindRefresh();
      this.bindQuickActions();
      this.bindSearch();
      this.bindCards();
      this.bindKeyboardShortcuts();
      this.setupCounters();
      this.updateDateTime();
      this.render();

      window.setInterval(() => this.updateDateTime(), 30000);

      document.dispatchEvent(new CustomEvent("tipax:dashboard-ready", {
        detail: { version: this.version }
      }));
    },

    defaultData() {
      return {
        shipments: 0,
        delivered: 0,
        returned: 0,
        closed: 0,
        pending: 0,
        cash: 0,
        postpaid: 0,
        totalAmount: 0,
        warehouseItems: 0,
        courierTasks: 0,
        lastUpdated: Date.now()
      };
    },

    loadData() {
      const defaults = this.defaultData();

      try {
        const raw = localStorage.getItem("tipax_dashboard_data");
        if (!raw) return defaults;

        const saved = JSON.parse(raw);
        if (!saved || typeof saved !== "object") return defaults;

        return { ...defaults, ...saved };
      } catch {
        return defaults;
      }
    },

    saveData(data) {
      try {
        localStorage.setItem(
          "tipax_dashboard_data",
          JSON.stringify({
            ...this.defaultData(),
            ...data,
            lastUpdated: Date.now()
          })
        );
        return true;
      } catch {
        return false;
      }
    },

    setData(data, options = {}) {
      const next = {
        ...this.defaultData(),
        ...this.state.data,
        ...data,
        lastUpdated: Date.now()
      };

      this.state.data = next;

      if (options.persist !== false) this.saveData(next);

      this.render();

      document.dispatchEvent(new CustomEvent(
        "tipax:dashboard-data-updated",
        { detail: next }
      ));

      return next;
    },

    getData() {
      return { ...this.state.data };
    },

    render() {
      const data = this.state.data || this.defaultData();

      this.renderValues(data);
      this.renderProgress(data);
      this.renderStatus(data);
      this.renderSummary(data);
      this.renderLastUpdated(data);
    },

    renderValues(data) {
      const values = {
        shipments: data.shipments,
        delivered: data.delivered,
        returned: data.returned,
        closed: data.closed,
        pending: data.pending,
        cash: data.cash,
        postpaid: data.postpaid,
        totalAmount: data.totalAmount,
        warehouseItems: data.warehouseItems,
        courierTasks: data.courierTasks
      };

      Object.entries(values).forEach(([key, value]) => {
        document.querySelectorAll(
          `[data-dashboard-value="${key}"]`
        ).forEach(element => {
          const money =
            element.hasAttribute("data-money") ||
            key === "cash" ||
            key === "postpaid" ||
            key === "totalAmount";

          element.textContent = money
            ? this.formatMoney(value)
            : this.formatNumber(value);
        });
      });
    },

    renderProgress(data) {
      const total = Math.max(this.toNumber(data.shipments), 1);

      const progress = {
        delivered: this.toNumber(data.delivered) / total * 100,
        returned: this.toNumber(data.returned) / total * 100,
        closed: this.toNumber(data.closed) / total * 100,
        pending: this.toNumber(data.pending) / total * 100
      };

      Object.entries(progress).forEach(([key, value]) => {
        const safe = this.clamp(value, 0, 100);

        document.querySelectorAll(
          `[data-dashboard-progress="${key}"]`
        ).forEach(element => {
          element.style.width = `${safe}%`;
          element.setAttribute("aria-valuenow", String(Math.round(safe)));
        });

        document.querySelectorAll(
          `[data-dashboard-progress-text="${key}"]`
        ).forEach(element => {
          element.textContent = `${safe.toFixed(1)}٪`;
        });
      });
    },

    renderStatus(data) {
      const total = this.toNumber(data.shipments);
      const pending = this.toNumber(data.pending);

      let status = "empty";
      if (total > 0 && pending > 0) status = "active";
      else if (total > 0) status = "complete";

      const labels = {
        empty: "بدون داده",
        active: "در حال عملیات",
        complete: "عملیات تکمیل"
      };

      document.querySelectorAll("[data-dashboard-status]").forEach(element => {
        element.dataset.status = status;
        element.textContent = labels[status];
      });
    },

    renderSummary(data) {
      const total = this.toNumber(data.shipments);
      const delivered = this.toNumber(data.delivered);

      let text = "هنوز اطلاعاتی برای نمایش ثبت نشده است.";

      if (total > 0) {
        const percent = this.clamp((delivered / total) * 100, 0, 100);
        text =
          `${this.formatNumber(delivered)} مرسوله از ` +
          `${this.formatNumber(total)} مرسوله تحویل شده ` +
          `(${percent.toFixed(1)}٪).`;
      }

      document.querySelectorAll("[data-dashboard-summary]").forEach(
        element => element.textContent = text
      );
    },

    renderLastUpdated(data) {
      if (!data.lastUpdated) return;

      const date = new Date(data.lastUpdated);

      document.querySelectorAll("[data-dashboard-updated]").forEach(
        element => {
          element.textContent = new Intl.DateTimeFormat("fa-IR", {
            hour: "2-digit",
            minute: "2-digit"
          }).format(date);
        }
      );
    },

    bindPeriodFilters() {
      document.addEventListener("click", event => {
        const button = event.target.closest(
          "[data-dashboard-period], [data-period]"
        );
        if (!button) return;

        event.preventDefault();

        const period =
          button.getAttribute("data-dashboard-period") ||
          button.getAttribute("data-period");

        if (!period) return;

        this.state.period = period;

        document.querySelectorAll(
          "[data-dashboard-period], [data-period]"
        ).forEach(item => {
          const value =
            item.getAttribute("data-dashboard-period") ||
            item.getAttribute("data-period");

          const active = value === period;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });

        this.refresh({ silent: true });
        this.notify("بازه گزارش تغییر کرد.", "success");
      });
    },

    bindRefresh() {
      document.addEventListener("click", event => {
        const button = event.target.closest(
          "[data-dashboard-refresh], .dashboard-refresh"
        );
        if (!button) return;

        event.preventDefault();
        this.refresh({ button });
      });
    },

    refresh(options = {}) {
      const button = options.button || null;
      const silent = Boolean(options.silent);

      if (this.refreshTimer) clearTimeout(this.refreshTimer);

      if (button) {
        button.classList.add("is-loading");
        button.setAttribute("aria-busy", "true");
        button.disabled = true;
      }

      document.body.classList.add("dashboard-refreshing");

      this.refreshTimer = setTimeout(() => {
        this.state.data = this.loadData();
        this.render();

        document.body.classList.remove("dashboard-refreshing");

        if (button) {
          button.classList.remove("is-loading");
          button.setAttribute("aria-busy", "false");
          button.disabled = false;
        }

        if (!silent) this.notify("اطلاعات داشبورد به‌روز شد.", "success");

        document.dispatchEvent(new CustomEvent(
          "tipax:dashboard-refresh",
          {
            detail: {
              period: this.state.period,
              data: this.state.data
            }
          }
        ));
      }, 350);
    },

    bindQuickActions() {
      document.addEventListener("click", event => {
        const button = event.target.closest("[data-quick-action]");
        if (!button) return;

        const routes = {
          shipments: "pages/shipments.html",
          register: "pages/register.html",
          reports: "pages/reports.html",
          warehouse: "pages/warehouse.html",
          couriers: "pages/couriers.html",
          excel: "pages/import-excel.html",
          api: "pages/api.html",
          settings: "pages/settings.html"
        };

        const action = button.getAttribute("data-quick-action");
        if (!routes[action]) return;

        button.classList.add("is-loading");
        setTimeout(() => {
          window.location.href = routes[action];
        }, 100);
      });
    },

    bindSearch() {
      document.addEventListener("input", event => {
        const input = event.target.closest(
          "[data-dashboard-search], #globalSearch"
        );
        if (!input) return;

        const query = String(input.value || "")
          .trim()
          .toLocaleLowerCase("fa");

        this.state.searchQuery = query;

        document.querySelectorAll(
          "[data-search-item], .dashboard-search-item"
        ).forEach(item => {
          const text = String(item.textContent || "")
            .toLocaleLowerCase("fa");

          item.hidden = Boolean(query) && !text.includes(query);
        });
      });
    },

    bindCards() {
      document.addEventListener("click", event => {
        const card = event.target.closest("[data-dashboard-card]");
        if (!card) return;

        if (event.target.closest("a, button, input, select, textarea")) return;

        const target = card.getAttribute("data-dashboard-card");
        if (!target || !target.startsWith("#")) return;

        document.querySelector(target)?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    },

    setupCounters() {
      const counters = document.querySelectorAll(
        "[data-counter], [data-dashboard-counter]"
      );

      if (!counters.length) return;

      if (!("IntersectionObserver" in window)) {
        counters.forEach(element => this.animateCounter(element));
        return;
      }

      this.counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const element = entry.target;
            if (element.dataset.counterAnimated === "true") return;

            element.dataset.counterAnimated = "true";
            this.animateCounter(element);
            observer.unobserve(element);
          });
        },
        { threshold: 0.2 }
      );

      counters.forEach(counter => this.counterObserver.observe(counter));
    },

    animateCounter(element) {
      const raw =
        element.getAttribute("data-counter") ||
        element.textContent ||
        "0";

      const target = this.toNumber(raw);
      if (!Number.isFinite(target)) return;

      const duration = Math.max(
        200,
        this.toNumber(
          element.getAttribute("data-counter-duration") || 850
        )
      );

      const startTime = performance.now();

      const frame = now => {
        const progress = this.clamp(
          (now - startTime) / duration,
          0,
          1
        );

        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = this.formatNumber(target * eased);

        if (progress < 1) requestAnimationFrame(frame);
        else element.textContent = this.formatNumber(target);
      };

      requestAnimationFrame(frame);
    },

    updateDateTime() {
      const now = new Date();

      document.querySelectorAll("[data-dashboard-date]").forEach(element => {
        element.textContent = new Intl.DateTimeFormat("fa-IR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }).format(now);
      });

      document.querySelectorAll("[data-dashboard-time]").forEach(element => {
        element.textContent = new Intl.DateTimeFormat("fa-IR", {
          hour: "2-digit",
          minute: "2-digit"
        }).format(now);
      });
    },

    bindKeyboardShortcuts() {
      document.addEventListener("keydown", event => {
        if (!event.altKey) return;

        const routes = {
          "1": "dashboard.html",
          "2": "pages/shipments.html",
          "3": "pages/register.html",
          "4": "pages/reports.html"
        };

        if (!routes[event.key]) return;

        event.preventDefault();
        window.location.href = routes[event.key];
      });
    },

    notify(message, type = "info") {
      if (window.Tipax && typeof window.Tipax.toast === "function") {
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

      document.querySelector("[data-dashboard-toast]")?.remove();

      const toast = document.createElement("div");
      toast.dataset.dashboardToast = "";
      toast.className = `tipax-dashboard-toast ${type}`;
      toast.textContent = message;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 250);
      }, 2400);
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

    formatNumber(value) {
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0
      }).format(this.toNumber(value));
    },

    formatMoney(value) {
      return `${this.formatNumber(value)} تومان`;
    },

    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
  };

  window.TipaxDashboard = Dashboard;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => Dashboard.init(),
      { once: true }
    );
  } else {
    Dashboard.init();
  }
})();
