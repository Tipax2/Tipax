/* =========================================================
   TIPAX ADMIN / OWNER PANEL
   Owner Panel Frontend Guard + UI State
   ========================================================= */

(function () {
  "use strict";

  /* -------------------------------------------------------
     Storage Keys
     ------------------------------------------------------- */

  const STORAGE_KEYS = {
    SESSION: "tipax_session",
    THEME: "tipax_theme"
  };

  /* -------------------------------------------------------
     Helpers
     ------------------------------------------------------- */

  const $ = (selector) => document.querySelector(selector);

  /* -------------------------------------------------------
     Read Current Session
     ------------------------------------------------------- */

  function readSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);

    } catch (error) {
      console.warn(
        "Tipax Admin: Invalid local session.",
        error
      );

      return null;
    }
  }

  /* -------------------------------------------------------
     Check Super Admin Role
     ------------------------------------------------------- */

  function isSuperAdmin(session) {
    if (!session) {
      return false;
    }

    const role = String(
      session.role ||
      (session.user && session.user.role) ||
      session.userRole ||
      ""
    ).toLowerCase();

    return role === "super_admin";
  }

  /* -------------------------------------------------------
     Redirect
     ------------------------------------------------------- */

  function redirectToLogin() {
    window.location.replace("../../login.html");
  }

  /* -------------------------------------------------------
     Toast
     ------------------------------------------------------- */

  function showToast(message) {
    const toast = $("#toast");

    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  /* -------------------------------------------------------
     Owner Panel Guard
     ------------------------------------------------------- */

  function guardOwnerPanel() {
    const session = readSession();

    /*
     * No session
     */
    if (!session) {
      redirectToLogin();
      return null;
    }

    /*
     * Logged in but not super_admin
     */
    if (!isSuperAdmin(session)) {

      showToast(
        "دسترسی این بخش فقط برای مالک سامانه است."
      );

      window.setTimeout(() => {
        window.location.replace("../../dashboard.html");
      }, 1200);

      return null;
    }

    return session;
  }

  /* -------------------------------------------------------
     Theme
     * ------------------------------------------------------- */

  function loadTheme() {
    const savedTheme =
      localStorage.getItem(
        STORAGE_KEYS.THEME
      );

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    }
  }

  function toggleTheme() {
    const isDark =
      document.body.classList.toggle("dark");

    localStorage.setItem(
      STORAGE_KEYS.THEME,
      isDark ? "dark" : "light"
    );
  }

  /* -------------------------------------------------------
     Render Owner Identity
     ------------------------------------------------------- */

  function renderIdentity(session) {

    const user =
      session.user ||
      session;

    const name =
      user.fullName ||
      user.name ||
      user.username ||
      "مالک سامانه";

    const role =
      user.role ||
      session.role ||
      "super_admin";

    const nameElement =
      $("#adminName");

    const roleElement =
      $("#adminRole");

    const securityRoleElement =
      $("#securityRole");

    if (nameElement) {
      nameElement.textContent =
        name;
    }

    if (roleElement) {
      roleElement.textContent =
        role;
    }

    if (securityRoleElement) {
      securityRoleElement.textContent =
        role;
    }
  }

  /* -------------------------------------------------------
     Temporary Activity State
     ------------------------------------------------------- */

  function renderActivityState() {

    const list =
      $("#activityList");

    if (!list) {
      return;
    }

    /*
     * فعلاً اطلاعات جعلی نمایش نمی‌دهیم.
     *
     * بعد از اتصال AuditLog API،
     * این قسمت با رویدادهای واقعی پر خواهد شد.
     */

    list.innerHTML = `
      <div class="activity-item">

        <span class="activity-dot"></span>

        <div>

          <strong>
            پنل مالک آماده اتصال است
          </strong>

          <small>
            رویدادهای واقعی پس از اتصال
            AuditLog API نمایش داده می‌شوند.
          </small>

        </div>

      </div>
    `;
  }

  /* -------------------------------------------------------
     Event Bindings
     ------------------------------------------------------- */

  function bindEvents() {

    /*
     * Theme
     */

    const themeButton =
      $("#themeToggle");

    if (themeButton) {

      themeButton.addEventListener(
        "click",
        toggleTheme
      );

    }

    /*
     * Logout
     */

    const logoutButton =
      $("#logoutBtn");

    if (logoutButton) {

      logoutButton.addEventListener(
        "click",
        function () {

          /*
           * فعلاً Session محلی حذف می‌شود.
           *
           * در مرحله Backend،
           * Logout واقعی نیز به Apps Script
           * متصل خواهد شد.
           */

          localStorage.removeItem(
            STORAGE_KEYS.SESSION
          );

          window.location.replace(
            "../../login.html"
          );
        }
      );

    }
  }

  /* -------------------------------------------------------
     Initialize
     ------------------------------------------------------- */

  function initAdminPanel() {

    /*
     * Load saved theme
     */

    loadTheme();

    /*
     * Security Guard
     */

    const session =
      guardOwnerPanel();

    if (!session) {
      return;
    }

    /*
     * Owner identity
     */

    renderIdentity(
      session
    );

    /*
     * UI events
     */

    bindEvents();

    /*
     * Activity area
     */

    renderActivityState();

    /*
     * مهم:
     * آمار واقعی عمداً اینجا ساخته نمی‌شوند.
     *
     * بعد از اتصال API:
     *
     * branchesCount
     * usersCount
     * subscriptionsCount
     *
     * از Google Apps Script دریافت خواهند شد.
     */

  }

  /* -------------------------------------------------------
     DOM Ready
     ------------------------------------------------------- */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initAdminPanel
    );

  } else {

    initAdminPanel();

  }

})();
