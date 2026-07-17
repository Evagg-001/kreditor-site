(function (window, document) {
  "use strict";

  function openLead() {
    if (
      window.KreditorLeadModal &&
      typeof window.KreditorLeadModal.open === "function"
    ) {
      window.KreditorLeadModal.open();
      return;
    }

    const dialog = document.querySelector("dialog");
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }

  function initialize() {
    document.querySelectorAll(".js-open-lead").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        openLead();
      });
    });
  }

  window.KreditorLeadFlow = Object.freeze({
    initialize,
    open: openLead
  });

})(window, document);
