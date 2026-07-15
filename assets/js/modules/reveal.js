(function (window, document) {
  "use strict";

  let initialized = false;

  function initialize() {
    if (initialized) {
      return false;
    }

    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) {
      return false;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1
        }
      );

      elements.forEach(function (element) {
        observer.observe(element);
      });
    } else {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
    }

    initialized = true;
    return true;
  }

  window.KreditorReveal = Object.freeze({
    initialize
  });
})(window, document);