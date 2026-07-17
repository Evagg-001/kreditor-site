(function (window, document) {
  "use strict";

  const OPEN_SELECTOR = [
    "[data-open-modal]",
    "[data-open-lead]",
    ".js-open-lead",
    ".header-cta",
    ".desktop-sticky-main"
  ].join(",");

  const CLOSE_SELECTOR = [
    "[data-close-modal]",
    ".modal-close"
  ].join(",");

  let initialized = false;

  function getModal() {
    return document.querySelector("#lead-modal");
  }

  function open() {
    const modal = getModal();

    if (!modal) {
      console.error("[KREDITOR LeadModal] #lead-modal не найден");
      return false;
    }

    if (modal.open) {
      return true;
    }

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }

    return true;
  }

  function close() {
    const modal = getModal();

    if (!modal) {
      return false;
    }

    if (typeof modal.close === "function" && modal.open) {
      modal.close();
    } else {
      modal.removeAttribute("open");
    }

    return true;
  }

  function handleClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const closeTrigger = target.closest(CLOSE_SELECTOR);

    if (closeTrigger) {
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
      return;
    }

    const openTrigger = target.closest(OPEN_SELECTOR);

    if (openTrigger) {
      event.preventDefault();
      event.stopImmediatePropagation();
      open();
      return;
    }

    const modal = getModal();

    if (modal && target === modal) {
      const rect = modal.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        close();
      }
    }
  }

  function initialize() {
    if (initialized) {
      return;
    }

    initialized = true;
    document.addEventListener("click", handleClick, true);
  }

  window.KreditorLeadModal = Object.freeze({
    initialize,
    open,
    close
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})(window, document);
