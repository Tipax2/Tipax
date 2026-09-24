/* =========================================================
   TIPAX SVG PANEL — CORE APPLICATION
   File: js/app.js
   Vanilla JS / No external dependency
   ========================================================= */

(() => {
  "use strict";

  const TipaxApp = {
    version: "1.0.0",
    storagePrefix: "tipax_",

    state: {
      theme: "light",
      sidebarOpen: false,
      loading: false
    },

    /* -------------------------------------------------------
       INIT
       ------------------------------------------------------- */

    init() {
      this.restoreTheme();
      this.initThemeControls();
      this.initSidebar();
      this.initNavigation();
      this.initScrollTop();
      this.initRipple();
      this.initDropdowns();
      this.initModals();
      this.initTabs();
      this.initAutoFormatNumbers();
      this.initTooltips();
      this.initGlobalShortcuts();
      this.initPageState();
      this.updateActiveNavigation();
      this.dispatch("tipax:ready", { version: this.version });
    },

    /* -------------------------------------------------------
       STORAGE
       ------------------------------------------------------- */

    storageKey(key) {
      return `${this.storagePrefix}${key}`;
    },

    getStorage(key, fallback = null) {
      try {
        const value = localStorage.getItem(this.storageKey(key));
        return value === null ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    },

    setStorage(key, value) {
      try {
        localStorage.setItem(this.storageKey(key), JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    removeStorage(key) {
      try {
        localStorage.removeItem(this.storageKey(key));
      } catch {}
    },

    /* -------------------------------------------------------
       THEME
       ------------------------------------------------------- */

    restoreTheme() {
      const saved = this.getStorage("theme");
      const systemDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      const theme = saved || (systemDark ? "dark" : "light");
      this.applyTheme(theme, false);
    },

    applyTheme(theme, save = true) {
      const normalized = theme === "dark" ? "dark" : "light";

      document.documentElement.dataset.theme = normalized;
      document.body.classList.toggle("dark", normalized === "dark");
      document.body.classList.toggle("light", normalized === "light");

      this.state.theme = normalized;

      if (save) {
        this.setStorage("theme", normalized);
      }

      document.querySelectorAll("[data-theme-icon]").forEach((el) => {
        const icon = el.getAttribute("data-theme-icon");
        if (icon === "text") {
          el.textContent = normalized === "dark" ? "حالت روشن" : "حالت تاریک";
        }
      });

      document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        button.setAttribute(
          "aria-label",
          normalized === "dark" ? "فعال کردن حالت روشن" : "فعال کردن حالت تاریک"
        );
        button.setAttribute("aria-pressed", normalized === "dark" ? "true" : "false");
      });

      this.dispatch("tipax:themechange", { theme: normalized });
    },

    toggleTheme() {
      this.applyTheme(this.state.theme === "dark" ? "light" : "dark");
    },

    initThemeControls() {
      document.addEventListener("click", (event) => {
        const target = event.target.closest("[data-theme-toggle]");
        if (!target) return;

        event.preventDefault();
        this.toggleTheme();
      });

      const media = window.matchMedia?.("(prefers-color-scheme: dark)");
      if (media) {
        media.addEventListener?.("change", (event) => {
          if (!this.getStorage("theme")) {
            this.applyTheme(event.matches ? "dark" : "light", false);
          }
        });
      }
    },

    /* -------------------------------------------------------
       SIDEBAR
       ------------------------------------------------------- */

    initSidebar() {
      const openers = document.querySelectorAll(
        "[data-sidebar-toggle], .sidebar-toggle, .menu-toggle"
      );

      openers.forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          this.toggleSidebar();
        });
      });

      document.addEventListener("click", (event) => {
        if (!this.state.sidebarOpen) return;

        const sidebar = document.querySelector(
          ".sidebar, .side-nav, [data-sidebar]"
        );

        const toggle = event.target.closest(
          "[data-sidebar-toggle], .sidebar-toggle, .menu-toggle"
        );

        if (
          sidebar &&
          !sidebar.contains(event.target) &&
          !toggle &&
          window.innerWidth <= 991
        ) {
          this.closeSidebar();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 991) {
          this.closeSidebar(false);
        }
      });
    },

    toggleSidebar() {
      this.state.sidebarOpen
        ? this.closeSidebar()
        : this.openSidebar();
    },

    openSidebar() {
      this.state.sidebarOpen = true;
      document.body.classList.add("sidebar-open");

      document.querySelectorAll(
        ".sidebar, .side-nav, [data-sidebar]"
      ).forEach((el) => el.classList.add("open"));

      document.querySelectorAll(
        "[data-sidebar-overlay], .sidebar-overlay"
      ).forEach((el) => el.classList.add("show"));
    },

    closeSidebar(animate = true) {
      this.state.sidebarOpen = false;
      document.body.classList.remove("sidebar-open");

      document.querySelectorAll(
        ".sidebar, .side-nav, [data-sidebar]"
      ).forEach((el) => el.classList.remove("open"));

      document.querySelectorAll(
        "[data-sidebar-overlay], .sidebar-overlay"
      ).forEach((el) => el.classList.remove("show"));

      if (!animate) return;
    },

    /* -------------------------------------------------------
       NAVIGATION
       ------------------------------------------------------- */

    initNavigation() {
      document.addEventListener("click", (event) => {
        const link = event.target.closest(
          "a[data-nav], [data-page-link]"
        );

        if (!link) return;

        const href = link.getAttribute("href");

        if (!href || href === "#" || href.startsWith("javascript:")) {
          return;
        }

        if (href.startsWith("http") && !href.includes(location.host)) {
          return;
        }

        this.setLoading(true);
      });

      window.addEventListener("pageshow", () => {
        this.setLoading(false);
      });
    },

    updateActiveNavigation() {
      const current = location.pathname
        .split("/")
        .filter(Boolean)
        .pop() || "index.html";

      document.querySelectorAll(
        "a[href], [data-page-link]"
      ).forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const normalized = href.split("?")[0].split("#")[0];
        const file = normalized.split("/").filter(Boolean).pop();

        if (file && file === current) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });
    },

    /* -------------------------------------------------------
       LOADING
       ------------------------------------------------------- */

    setLoading(show) {
      this.state.loading = Boolean(show);
      document.body.classList.toggle("is-loading", this.state.loading);

      document.querySelectorAll("[data-page-loader]").forEach((el) => {
        el.classList.toggle("show", this.state.loading);
      });
    },

    /* -------------------------------------------------------
       SCROLL TO TOP
       ------------------------------------------------------- */

    initScrollTop() {
      const buttons = document.querySelectorAll(
        "[data-scroll-top], .scroll-top, .back-to-top, .floating-top-button"
      );

      const update = () => {
        const visible = window.scrollY > 260;

        buttons.forEach((button) => {
          button.classList.toggle("show", visible);
          button.setAttribute("aria-hidden", visible ? "false" : "true");
        });
      };

      buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        });
      });

      window.addEventListener("scroll", update, { passive: true });
      update();
    },

    /* -------------------------------------------------------
       RIPPLE EFFECT
       ------------------------------------------------------- */

    initRipple() {
      document.addEventListener("click", (event) => {
        const button = event.target.closest(
          "[data-ripple], .tipax-btn, .btn"
        );

        if (!button) return;

        const rect = button.getBoundingClientRect();
        const ripple = document.createElement("span");

        ripple.className = "tipax-ripple";

        const size = Math.max(rect.width, rect.height);

        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

        if (getComputedStyle(button).position === "static") {
          button.style.position = "relative";
        }

        button.style.overflow = "hidden";
        button.appendChild(ripple);

        window.setTimeout(() => ripple.remove(), 550);
      });
    },

    /* -------------------------------------------------------
       DROPDOWNS
       ------------------------------------------------------- */

    initDropdowns() {
      document.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-dropdown-toggle]");

        if (toggle) {
          event.preventDefault();

          const selector = toggle.getAttribute("data-dropdown-toggle");
          const menu = document.querySelector(selector);

          if (!menu) return;

          const wasOpen = menu.classList.contains("open");

          this.closeDropdowns();

          if (!wasOpen) {
            menu.classList.add("open");
            toggle.setAttribute("aria-expanded", "true");
          }

          return;
        }

        if (!event.target.closest(
          ".dropdown, [data-dropdown], .dropdown-menu"
        )) {
          this.closeDropdowns();
        }
      });
    },

    closeDropdowns() {
      document.querySelectorAll(
        ".dropdown-menu.open, [data-dropdown-menu].open"
      ).forEach((menu) => menu.classList.remove("open"));

      document.querySelectorAll("[data-dropdown-toggle]").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
      });
    },

    /* -------------------------------------------------------
       MODALS
       ------------------------------------------------------- */

    initModals() {
      document.addEventListener("click", (event) => {
        const opener = event.target.closest("[data-modal-open]");

        if (opener) {
          event.preventDefault();
          const selector = opener.getAttribute("data-modal-open");
          this.openModal(selector);
          return;
        }

        const closer = event.target.closest("[data-modal-close]");

        if (closer) {
          event.preventDefault();
          this.closeModal(closer.closest(".page-modal, [data-modal]"));
          return;
        }

        const modal = event.target.closest(".page-modal, [data-modal]");

        if (
          modal &&
          event.target === modal &&
          modal.getAttribute("data-modal-backdrop") !== "false"
        ) {
          this.closeModal(modal);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          const openModal = document.querySelector(
            ".page-modal.open, [data-modal].open"
          );

          if (openModal) {
            this.closeModal(openModal);
          }
        }
      });
    },

    openModal(selectorOrElement) {
      const modal =
        typeof selectorOrElement === "string"
          ? document.querySelector(selectorOrElement)
          : selectorOrElement;

      if (!modal) return false;

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      return true;
    },

    closeModal(selectorOrElement) {
      const modal =
        typeof selectorOrElement === "string"
          ? document.querySelector(selectorOrElement)
          : selectorOrElement;

      if (!modal) return false;

      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");

      if (!document.querySelector(".page-modal.open, [data-modal].open")) {
        document.body.classList.remove("modal-open");
      }

      return true;
    },

    /* -------------------------------------------------------
       TABS
       ------------------------------------------------------- */

    initTabs() {
      document.addEventListener("click", (event) => {
        const tab = event.target.closest("[data-tab-target]");

        if (!tab) return;

        event.preventDefault();

        const targetSelector = tab.getAttribute("data-tab-target");
        const target = document.querySelector(targetSelector);

        if (!target) return;

        const group =
          tab.closest("[data-tabs]") ||
          tab.parentElement;

        group?.querySelectorAll(
          "[data-tab-target]"
        ).forEach((item) => {
          item.classList.toggle("active", item === tab);
          item.setAttribute(
            "aria-selected",
            item === tab ? "true" : "false"
          );
        });

        const panelGroup =
          target.closest("[data-tab-panels]") ||
          target.parentElement;

        if (panelGroup) {
          panelGroup.querySelectorAll(
            "[data-tab-panel]"
          ).forEach((panel) => {
            panel.classList.toggle("active", panel === target);
            panel.hidden = panel !== target;
          });
        } else {
          document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
            panel.classList.toggle("active", panel === target);
            panel.hidden = panel !== target;
          });
        }

        this.dispatch("tipax:tabchange", {
          tab,
          panel: target
        });
      });
    },

    /* -------------------------------------------------------
       NUMBER / MONEY FORMAT
       ------------------------------------------------------- */

    formatNumber(value) {
      if (value === null || value === undefined || value === "") {
        return "";
      }

      const raw = String(value).replace(/[^\d.-]/g, "");
      const number = Number(raw);

      if (!Number.isFinite(number)) {
        return String(value);
      }

      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0
      }).format(number);
    },

    formatMoney(value) {
      const formatted = this.formatNumber(value);
      return formatted ? `${formatted} تومان` : "";
    },

    parseNumber(value) {
      if (value === null || value === undefined) return 0;

      const cleaned = String(value)
        .replace(/,/g, "")
        .replace(/[^\d.-]/g, "");

      const number = Number(cleaned);

      return Number.isFinite(number) ? number : 0;
    },

    initAutoFormatNumbers() {
      document.addEventListener("input", (event) => {
        const input = event.target.closest(
          "[data-number-format], [data-money-input]"
        );

        if (!input) return;

        const cursor = input.selectionStart;
        const beforeLength = input.value.length;

        const numeric = input.value.replace(/[^\d]/g, "");

        if (!numeric) {
          input.value = "";
          return;
        }

        input.value = this.formatNumber(numeric);

        const difference = input.value.length - beforeLength;

        try {
          input.setSelectionRange(
            Math.max(0, cursor + difference),
            Math.max(0, cursor + difference)
          );
        } catch {}
      });
    },

    /* -------------------------------------------------------
       TOOLTIPS
       ------------------------------------------------------- */

    initTooltips() {
      document.addEventListener("mouseenter", (event) => {
        const target = event.target.closest("[data-tooltip]");
        if (!target) return;

        const text = target.getAttribute("data-tooltip");
        if (!text) return;

        target.setAttribute("title", text);
      }, true);
    },

    /* -------------------------------------------------------
       KEYBOARD SHORTCUTS
       ------------------------------------------------------- */

    initGlobalShortcuts() {
      document.addEventListener("keydown", (event) => {
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "k"
        ) {
          const search = document.querySelector(
            "[data-global-search], #globalSearch, .global-search input"
          );

          if (search) {
            event.preventDefault();
            search.focus();
          }
        }

        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "b"
        ) {
          const button = document.querySelector(
            "[data-sidebar-toggle], .sidebar-toggle, .menu-toggle"
          );

          if (button && window.innerWidth <= 991) {
            event.preventDefault();
            this.toggleSidebar();
          }
        }
      });
    },

    /* -------------------------------------------------------
       PAGE STATE
       ------------------------------------------------------- */

    initPageState() {
      document.documentElement.classList.add("tipax-ready");

      document.querySelectorAll("[data-current-date]").forEach((el) => {
        const date = new Intl.DateTimeFormat("fa-IR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }).format(new Date());

        el.textContent = date;
      });

      document.querySelectorAll("[data-current-time]").forEach((el) => {
        const update = () => {
          el.textContent = new Intl.DateTimeFormat("fa-IR", {
            hour: "2-digit",
            minute: "2-digit"
          }).format(new Date());
        };

        update();
        window.setInterval(update, 30000);
      });
    },

    /* -------------------------------------------------------
       TOAST
       ------------------------------------------------------- */

    toast(message, type = "info", duration = 3200) {
      let container = document.querySelector("[data-toast-container]");

      if (!container) {
        container = document.createElement("div");
        container.className = "tipax-toast-container";
        container.setAttribute("data-toast-container", "");
        document.body.appendChild(container);
      }

      const toast = document.createElement("div");
      toast.className = `tipax-toast ${type}`;

      const iconMap = {
        success: "✓",
        error: "×",
        warning: "!",
        info: "i"
      };

      const icon = document.createElement("span");
      icon.className = "tipax-toast-icon";
      icon.textContent = iconMap[type] || iconMap.info;

      const text = document.createElement("span");
      text.className = "tipax-toast-text";
      text.textContent = message;

      const close = document.createElement("button");
      close.type = "button";
      close.className = "tipax-toast-close";
      close.setAttribute("aria-label", "بستن");
      close.textContent = "×";

      close.addEventListener("click", () => toast.remove());

      toast.append(icon, text, close);
      container.appendChild(toast);

      requestAnimationFrame(() => toast.classList.add("show"));

      window.setTimeout(() => {
        toast.classList.remove("show");
        window.setTimeout(() => toast.remove(), 250);
      }, duration);

      return toast;
    },

    /* -------------------------------------------------------
       CONFIRM
       ------------------------------------------------------- */

    confirm(message, options = {}) {
      const {
        title = "تأیید عملیات",
        confirmText = "تأیید",
        cancelText = "انصراف"
      } = options;

      return new Promise((resolve) => {
        const modal = document.createElement("div");

        modal.className = "page-modal open";
        modal.setAttribute("data-generated-modal", "");
        modal.innerHTML = `
          <div class="page-modal-card" role="dialog" aria-modal="true">
            <div class="page-modal-header">
              <h2>${this.escapeHTML(title)}</h2>
              <button type="button" data-confirm-cancel aria-label="بستن">×</button>
            </div>
            <div class="page-modal-body">
              <p>${this.escapeHTML(message)}</p>
            </div>
            <div class="page-modal-footer">
              <button type="button" class="tipax-btn" data-confirm-cancel>
                ${this.escapeHTML(cancelText)}
              </button>
              <button type="button" class="tipax-btn primary" data-confirm-ok>
                ${this.escapeHTML(confirmText)}
              </button>
            </div>
          </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add("modal-open");

        const finish = (result) => {
          modal.remove();
          if (!document.querySelector(".page-modal.open")) {
            document.body.classList.remove("modal-open");
          }
          resolve(result);
        };

        modal.querySelector("[data-confirm-ok]")
          ?.addEventListener("click", () => finish(true));

        modal.querySelectorAll("[data-confirm-cancel]")
          .forEach((button) => {
            button.addEventListener("click", () => finish(false));
          });
      });
    },

    /* -------------------------------------------------------
       HELPERS
       ------------------------------------------------------- */

    escapeHTML(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    dispatch(name, detail = {}) {
      document.dispatchEvent(
        new CustomEvent(name, { detail })
      );
    }
  };

  /* ---------------------------------------------------------
     GLOBAL API
     --------------------------------------------------------- */

  window.TipaxApp = TipaxApp;

  window.Tipax = {
    formatNumber: (...args) => TipaxApp.formatNumber(...args),
    formatMoney: (...args) => TipaxApp.formatMoney(...args),
    parseNumber: (...args) => TipaxApp.parseNumber(...args),
    toast: (...args) => TipaxApp.toast(...args),
    confirm: (...args) => TipaxApp.confirm(...args),
    openModal: (...args) => TipaxApp.openModal(...args),
    closeModal: (...args) => TipaxApp.closeModal(...args),
    toggleTheme: (...args) => TipaxApp.toggleTheme(...args),
    setTheme: (...args) => TipaxApp.applyTheme(...args)
  };

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => TipaxApp.init(), {
      once: true
    });
  } else {
    TipaxApp.init();
  }

})();
