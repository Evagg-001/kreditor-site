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