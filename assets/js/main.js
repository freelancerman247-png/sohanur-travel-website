(function () {
  "use strict";

  var siteConfig = {
    businessName: "Sohanur Travels",
    whatsappNumber: "8801712345678",
    defaultMessage: "Hello Sohanur Travels, I want to plan a trip. Please share details."
  };

  var header = document.querySelector("[data-header]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-nav-menu]");
  var yearTargets = document.querySelectorAll("[data-year]");
  var whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
  var whatsappForms = document.querySelectorAll("[data-whatsapp-form]");
  var packageButtons = document.querySelectorAll("[data-package]");
  var accordion = document.querySelector("[data-accordion]");

  function buildWhatsAppUrl(message) {
    return "https://wa.me/" + siteConfig.whatsappNumber + "?text=" + encodeURIComponent(message);
  }

  function closeNavigation() {
    if (!navToggle || !navMenu) {
      return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function toggleNavigation() {
    if (!navToggle || !navMenu) {
      return;
    }

    var isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  }

  function updateHeaderState() {
    if (!header) {
      return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function formatFormMessage(form) {
    var formData = new FormData(form);
    var lines = ["Hello " + siteConfig.businessName + ", I want travel assistance."];

    formData.forEach(function (value, key) {
      var cleanValue = String(value).trim();

      if (!cleanValue) {
        return;
      }

      var label = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, function (letter) {
          return letter.toUpperCase();
        });

      lines.push(label + ": " + cleanValue);
    });

    return lines.join("\n");
  }

  function initRevealAnimation() {
    var revealItems = document.querySelectorAll(".reveal");

    if (!revealItems.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function initAccordion() {
    if (!accordion) {
      return;
    }

    var triggers = accordion.querySelectorAll(".accordion-trigger");

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var isExpanded = trigger.getAttribute("aria-expanded") === "true";

        triggers.forEach(function (otherTrigger) {
          otherTrigger.setAttribute("aria-expanded", "false");
          var symbol = otherTrigger.querySelector("span");
          if (symbol) {
            symbol.textContent = "+";
          }
        });

        trigger.setAttribute("aria-expanded", String(!isExpanded));
        var currentSymbol = trigger.querySelector("span");
        if (currentSymbol) {
          currentSymbol.textContent = isExpanded ? "+" : "-";
        }
      });
    });
  }

  if (navToggle) {
    navToggle.addEventListener("click", toggleNavigation);
  }

  if (navMenu) {
    navMenu.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        closeNavigation();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();

  yearTargets.forEach(function (target) {
    target.textContent = String(new Date().getFullYear());
  });

  whatsappLinks.forEach(function (link) {
    link.setAttribute("href", buildWhatsAppUrl(siteConfig.defaultMessage));
  });

  packageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var packageName = button.getAttribute("data-package") || "travel package";
      var message = "Hello " + siteConfig.businessName + ", I want details and pricing for: " + packageName + ".";
      window.open(buildWhatsAppUrl(message), "_blank", "noopener");
    });
  });

  whatsappForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      window.open(buildWhatsAppUrl(formatFormMessage(form)), "_blank", "noopener");
      form.reset();
    });
  });

  initRevealAnimation();
  initAccordion();
})();
