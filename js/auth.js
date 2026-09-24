/* =========================================================
   TIPAX SVG PANEL — AUTHENTICATION CORE
   File: js/auth.js
   GitHub Pages demo + future server-ready structure
   ========================================================= */

(() => {
  "use strict";

  const Auth = {
    version: "1.0.0",
    storageKey: "tipax_auth",
    sessionKey: "tipax_session",
    usersKey: "tipax_demo_users",

    config: {
      loginPage: "login.html",
      defaultPage: "dashboard.html",
      sessionMinutes: 480,
      rememberDays: 30,
      requireLoginOnPages: true
    },

    /* -------------------------------------------------------
       DEMO USERS
       ------------------------------------------------------- */

    demoUsers: [
      {
        username: "admin",
        password: "1234",
        name: "مدیر سامانه",
        role: "admin"
      },
      {
        username: "tipax",
        password: "1234",
        name: "کاربر تیپاکس",
        role: "operator"
      }
    ],

    /* -------------------------------------------------------
       INIT
       ------------------------------------------------------- */

    init() {
      this.seedDemoUsers();
      this.bindLoginForm();
      this.bindLogout();
      this.bindPasswordToggles();
      this.updateUserUI();
      this.protectCurrentPage();
      this.watchSession();
    },

    /* -------------------------------------------------------
       STORAGE HELPERS
       ------------------------------------------------------- */

    read(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },

    write(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {}
    },

    seedDemoUsers() {
      if (!this.read(this.usersKey)) {
        this.write(this.usersKey, this.demoUsers);
      }
    },

    /* -------------------------------------------------------
       USER / SESSION
       ------------------------------------------------------- */

    getCurrentUser() {
      return this.read(this.storageKey);
    },

    isLoggedIn() {
      const auth = this.getCurrentUser();

      if (!auth || auth.loggedIn !== true) {
        return false;
      }

      if (auth.expiresAt && Date.now() >= auth.expiresAt) {
        this.logout(false);
        return false;
      }

      return true;
    },

    login(username, password, remember = false) {
      const cleanUsername = String(username || "").trim();

      if (!cleanUsername || !password) {
        return {
          success: false,
          message: "نام کاربری و رمز عبور را وارد کنید."
        };
      }

      const users = this.read(this.usersKey, this.demoUsers);

      const user = users.find(
        item =>
          String(item.username).toLowerCase() === cleanUsername.toLowerCase() &&
          String(item.password) === String(password)
      );

      if (!user) {
        return {
          success: false,
          message: "نام کاربری یا رمز عبور صحیح نیست."
        };
      }

      const now = Date.now();

      const lifetime = remember
        ? this.config.rememberDays * 24 * 60 * 60 * 1000
        : this.config.sessionMinutes * 60 * 1000;

      const session = {
        loggedIn: true,
        username: user.username,
        name: user.name || user.username,
        role: user.role || "operator",
        loginAt: now,
        lastActivity: now,
        expiresAt: now + lifetime,
        remember
      };

      this.write(this.storageKey, session);
      this.write(this.sessionKey, {
        id: this.createSessionId(),
        createdAt: now
      });

      this.updateUserUI();
      this.dispatch("tipax:login", session);

      return {
        success: true,
        user: session
      };
    },

    logout(redirect = true) {
      const oldUser = this.getCurrentUser();

      this.remove(this.storageKey);
      this.remove(this.sessionKey);

      this.dispatch("tipax:logout", oldUser);

      if (redirect) {
        const loginUrl = this.buildLoginUrl();
        window.location.replace(loginUrl);
      }
    },

    createSessionId() {
      if (window.crypto?.randomUUID) {
        return crypto.randomUUID();
      }

      return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
      );
    },

    /* -------------------------------------------------------
       PAGE PROTECTION
       ------------------------------------------------------- */

    isLoginPage() {
      const file = this.currentFile();
      return file === "login.html" || file === "";
    },

    isPublicPage() {
      const publicPages = [
        "index.html",
        "login.html"
      ];

      return publicPages.includes(this.currentFile());
    },

    currentFile() {
      return (
        window.location.pathname
          .split("/")
          .filter(Boolean)
          .pop() || "index.html"
      ).toLowerCase();
    },

    protectCurrentPage() {
      if (!this.config.requireLoginOnPages) return;
      if (this.isPublicPage()) return;

      if (!this.isLoggedIn()) {
        const current = window.location.pathname;

        const params = new URLSearchParams();
        if (current && !current.endsWith("login.html")) {
          params.set("redirect", current);
        }

        const query = params.toString();
        const target =
          this.config.loginPage +
          (query ? `?${query}` : "");

        window.location.replace(target);
      }
    },

    redirectAfterLogin() {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("redirect");

      if (
        requested &&
        requested.startsWith("/") &&
        !requested.includes("://")
      ) {
        window.location.replace(requested);
        return;
      }

      window.location.replace(this.config.defaultPage);
    },

    /* -------------------------------------------------------
       LOGIN FORM
       ------------------------------------------------------- */

    bindLoginForm() {
      const form = document.querySelector(
        "#loginForm, [data-login-form]"
      );

      if (!form) return;

      const usernameInput = form.querySelector(
        '[name="username"], #username, [data-login-username]'
      );

      const passwordInput = form.querySelector(
        '[name="password"], #password, [data-login-password]'
      );

      const rememberInput = form.querySelector(
        '[name="remember"], #remember, [data-login-remember]'
      );

      const submitButton = form.querySelector(
        'button[type="submit"], [data-login-submit]'
      );

      form.addEventListener("submit", event => {
        event.preventDefault();

        const username = usernameInput?.value || "";
        const password = passwordInput?.value || "";
        const remember = Boolean(rememberInput?.checked);

        this.clearLoginError(form);

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.classList.add("is-loading");
        }

        const result = this.login(username, password, remember);

        if (!result.success) {
          this.showLoginError(form, result.message);

          if (submitButton) {
            submitButton.disabled = false;
            submitButton.classList.remove("is-loading");
          }

          passwordInput?.focus();
          return;
        }

        this.showLoginSuccess(form);

        window.setTimeout(() => {
          this.redirectAfterLogin();
        }, 250);
      });

      [usernameInput, passwordInput].forEach(input => {
        input?.addEventListener("input", () => {
          this.clearLoginError(form);
        });
      });
    },

    showLoginError(form, message) {
      let box = form.querySelector("[data-login-error]");

      if (!box) {
        box = document.createElement("div");
        box.setAttribute("data-login-error", "");
        box.className = "tipax-auth-message error";

        form.prepend(box);
      }

      box.textContent = message;
      box.hidden = false;
      box.classList.add("show");
    },

    clearLoginError(form) {
      const box = form.querySelector("[data-login-error]");

      if (!box) return;

      box.hidden = true;
      box.classList.remove("show");
      box.textContent = "";
    },

    showLoginSuccess(form) {
      let box = form.querySelector("[data-login-success]");

      if (!box) {
        box = document.createElement("div");
        box.setAttribute("data-login-success", "");
        box.className = "tipax-auth-message success";
        form.prepend(box);
      }

      box.textContent = "ورود موفق بود؛ در حال ورود به سامانه...";
      box.hidden = false;
      box.classList.add("show");
    },

    /* -------------------------------------------------------
       PASSWORD VISIBILITY
       ------------------------------------------------------- */

    bindPasswordToggles() {
      document.addEventListener("click", event => {
        const button = event.target.closest(
          "[data-password-toggle], .password-toggle"
        );

        if (!button) return;

        event.preventDefault();

        const targetSelector =
          button.getAttribute("data-password-toggle");

        const input = targetSelector
          ? document.querySelector(targetSelector)
          : button.parentElement?.querySelector(
              'input[type="password"], input[data-password]'
            );

        if (!input) return;

        const visible = input.type === "text";

        input.type = visible ? "password" : "text";

        button.classList.toggle("active", !visible);
        button.setAttribute(
          "aria-label",
          visible ? "نمایش رمز عبور" : "پنهان کردن رمز عبور"
        );

        button.setAttribute(
          "aria-pressed",
          visible ? "false" : "true"
        );
      });
    },

    /* -------------------------------------------------------
       LOGOUT
       ------------------------------------------------------- */

    bindLogout() {
      document.addEventListener("click", event => {
        const button = event.target.closest(
          "[data-logout], .logout-button"
        );

        if (!button) return;

        event.preventDefault();

        const message =
          button.getAttribute("data-logout-confirm");

        if (!message) {
          this.logout();
          return;
        }

        const confirmFn = window.Tipax?.confirm;

        if (typeof confirmFn === "function") {
          confirmFn(message, {
            title: "خروج از سامانه",
            confirmText: "خروج",
            cancelText: "انصراف"
          }).then(ok => {
            if (ok) this.logout();
          });
        } else if (window.confirm(message)) {
          this.logout();
        }
      });
    },

    /* -------------------------------------------------------
       USER UI
       ------------------------------------------------------- */

    updateUserUI() {
      const user = this.getCurrentUser();

      document.querySelectorAll(
        "[data-user-name], .user-name"
      ).forEach(el => {
        el.textContent = user?.name || "کاربر";
      });

      document.querySelectorAll(
        "[data-user-username]"
      ).forEach(el => {
        el.textContent = user?.username || "";
      });

      document.querySelectorAll(
        "[data-user-role]"
      ).forEach(el => {
        el.textContent = this.roleLabel(user?.role);
      });

      document.querySelectorAll(
        "[data-auth-only]"
      ).forEach(el => {
        el.hidden = !this.isLoggedIn();
      });

      document.querySelectorAll(
        "[data-guest-only]"
      ).forEach(el => {
        el.hidden = this.isLoggedIn();
      });
    },

    roleLabel(role) {
      const labels = {
        admin: "مدیر سامانه",
        operator: "اپراتور",
        manager: "مدیر شعبه",
        viewer: "مشاهده‌گر"
      };

      return labels[role] || "کاربر";
    },

    /* -------------------------------------------------------
       SESSION ACTIVITY
       ------------------------------------------------------- */

    watchSession() {
      if (!this.isLoggedIn()) return;

      const activityEvents = [
        "click",
        "keydown",
        "mousemove",
        "scroll",
        "touchstart"
      ];

      let timer = null;

      const refresh = () => {
        const user = this.getCurrentUser();

        if (!user || !user.loggedIn) return;

        user.lastActivity = Date.now();

        if (user.remember) {
          user.expiresAt =
            Date.now() +
            this.config.rememberDays * 24 * 60 * 60 * 1000;
        } else {
          user.expiresAt =
            Date.now() +
            this.config.sessionMinutes * 60 * 1000;
        }

        this.write(this.storageKey, user);
      };

      const throttled = () => {
        if (timer) return;

        timer = window.setTimeout(() => {
          timer = null;
          refresh();
        }, 30000);
      };

      activityEvents.forEach(eventName => {
        window.addEventListener(eventName, throttled, {
          passive: true
        });
      });

      window.setInterval(() => {
        if (!this.isLoggedIn()) return;

        const user = this.getCurrentUser();

        if (
          user &&
          user.expiresAt &&
          Date.now() >= user.expiresAt
        ) {
          this.logout();
        }
      }, 30000);
    },

    /* -------------------------------------------------------
       ROLE / PERMISSION
       ------------------------------------------------------- */

    hasRole(...roles) {
      const user = this.getCurrentUser();

      if (!user) return false;

      return roles.includes(user.role);
    },

    can(permission) {
      const user = this.getCurrentUser();

      if (!user) return false;

      const permissions = {
        admin: [
          "dashboard",
          "shipments",
          "register",
          "reports",
          "warehouse",
          "couriers",
          "excel",
          "api",
          "settings"
        ],
        manager: [
          "dashboard",
          "shipments",
          "register",
          "reports",
          "warehouse",
          "couriers",
          "excel"
        ],
        operator: [
          "dashboard",
          "shipments",
          "register",
          "reports"
        ],
        viewer: [
          "dashboard",
          "shipments",
          "reports"
        ]
      };

      return (
        permissions[user.role]?.includes(permission) ||
        false
      );
    },

    enforcePermission(permission, fallback = "dashboard.html") {
      if (!this.isLoggedIn()) {
        this.protectCurrentPage();
        return false;
      }

      if (this.can(permission)) {
        return true;
      }

      window.location.replace(fallback);
      return false;
    },

    /* -------------------------------------------------------
       EVENTS
       ------------------------------------------------------- */

    dispatch(name, detail = {}) {
      document.dispatchEvent(
        new CustomEvent(name, { detail })
      );
    }
  };

  /* ---------------------------------------------------------
     GLOBAL API
     --------------------------------------------------------- */

  window.TipaxAuth = Auth;

  /* Backward-friendly aliases */
  window.TipaxAuth.login = Auth.login.bind(Auth);
  window.TipaxAuth.logout = Auth.logout.bind(Auth);

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => Auth.init(),
      { once: true }
    );
  } else {
    Auth.init();
  }

})();
