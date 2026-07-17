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

  function bindLeadForms() {
    document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
      if (form.dataset.leadBound === "true") {
        return;
      }

      form.dataset.leadBound = "true";

      form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(form));

        try {
          const endpoint =
            window.KreditorConfig?.leadEndpoint || "/api/v1/leads";

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });

          if (!response.ok) {
            throw new Error("Lead request failed");
          }

          form.reset();

          document.dispatchEvent(
            new CustomEvent("kreditor:lead-success")
          );

        } catch (error) {
          console.error(
            "[KREDITOR LeadFlow] Ошибка отправки:",
            error
          );
        }
      });
    });
  }

  function initialize() {
    document.querySelectorAll(".js-open-lead").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        openLead();
      });
    });

    bindLeadForms();
  }

  window.KreditorLeadFlow = Object.freeze({
    initialize,
    open: openLead
  });

})(window, document);
