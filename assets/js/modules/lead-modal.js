(function (window, document) {
  "use strict";

  let initialized = false;

  function initialize() {
    if (initialized) {
      return false;
    }

    const modal = document.querySelector("#lead-modal");

    if (!modal) {
      return false;
    }

    document.querySelectorAll("[data-open-modal]").forEach(function (button) {
      button.addEventListener("click", function () {
        modal.showModal();

        if (window.KreditorAnalytics) {
          window.KreditorAnalytics.track("open_lead_modal", {
            path: window.location.pathname
          });
        }
      });
    });

    document.querySelector("[data-close-modal]")?.addEventListener(
      "click",
      function () {
        modal.close();
      }
    );

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.close();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.open) {
        modal.close();
      }
    });

    initialized = true;
    return true;
  }

  window.KreditorLeadModal = Object.freeze({
    initialize
  });
})(window, document);

/* KREDITOR modal trigger fallback */
(function (window, document) {
  "use strict";

  function bindModalTriggers() {
    if (document.documentElement.dataset.kreditorModalTriggersBound === "1") {
      return;
    }

    document.documentElement.dataset.kreditorModalTriggersBound = "1";

    document.addEventListener("click", function (event) {
      const openTrigger = event.target.closest(
        "[data-open-modal], .js-open-lead"
      );

      if (openTrigger) {
        const modal = document.querySelector("#lead-modal");

        if (modal && typeof modal.showModal === "function") {
          event.preventDefault();

          if (!modal.open) {
            modal.showModal();
          }
        }

        return;
      }

      const closeTrigger = event.target.closest("[data-close-modal]");

      if (closeTrigger) {
        const modal = closeTrigger.closest("dialog");

        if (modal && modal.open) {
          event.preventDefault();
          modal.close();
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindModalTriggers, {
      once: true
    });
  } else {
    bindModalTriggers();
  }
})(window, document);
