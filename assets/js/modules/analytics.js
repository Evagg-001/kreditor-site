(function (window, document) {
  "use strict";

  const DEFAULT_CONFIG = Object.freeze({
    yandexMetrikaId: 110621481,
    consentKey: "kreditor_analytics_consent"
  });

  let initialized = false;

  function getConfig() {
    return Object.assign(
      {},
      DEFAULT_CONFIG,
      window.KREDITOR_ANALYTICS || {}
    );
  }

  function hasConsent() {
    const { consentKey } = getConfig();

    try {
      return window.localStorage.getItem(consentKey) === "accepted";
    } catch {
      return false;
    }
  }

  function loadYandexMetrika(counterId) {
    if (typeof window.ym === "function") {
      return;
    }

    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };

    window.ym.l = Date.now();

    const script = document.createElement("script");
    const firstScript = document.getElementsByTagName("script")[0];

    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    script.referrerPolicy = "strict-origin-when-cross-origin";

    firstScript.parentNode.insertBefore(script, firstScript);

    window.ym(counterId, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false
    });
  }

  function init() {
    const { yandexMetrikaId } = getConfig();
    const counterId = Number(yandexMetrikaId);

    if (
      initialized ||
      !Number.isInteger(counterId) ||
      counterId <= 0 ||
      !hasConsent()
    ) {
      return false;
    }

    initialized = true;
    loadYandexMetrika(counterId);

    return true;
  }

  function track(eventName, parameters = {}) {
    if (typeof eventName !== "string" || !eventName.trim()) {
      return false;
    }

    const { yandexMetrikaId } = getConfig();
    const counterId = Number(yandexMetrikaId);

    try {
      if (
        hasConsent() &&
        Number.isInteger(counterId) &&
        counterId > 0 &&
        typeof window.ym === "function"
      ) {
        window.ym(counterId, "reachGoal", eventName, parameters);
      }

      window.dispatchEvent(
        new CustomEvent("kreditor:analytics", {
          detail: {
            event: eventName,
            params: parameters
          }
        })
      );

      return true;
    } catch {
      return false;
    }
  }

  window.KreditorAnalytics = Object.freeze({
    init,
    track,
    hasConsent
  });
})(window, document);