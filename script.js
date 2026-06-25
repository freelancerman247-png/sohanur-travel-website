const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const bookingForm = document.querySelector("[data-booking-form]");
const contactForm = document.querySelector("[data-contact-form]");
const destinationSelect = document.querySelector("[data-destination-select]");
const formStatus = document.querySelector("[data-form-status]");
const contactStatus = document.querySelector("[data-contact-status]");
const packageButtons = document.querySelectorAll("[data-package]");
const mobileInputs = document.querySelectorAll("[data-mobile-input]");
const mobilePattern = /^(?:[6-9]\d{9}|05\d{8}|(?:\+966|966)\d{8})$/;
const mobileHelpText =
  "Enter a valid Indian (9876543210) or Saudi number (0501234567, 96612345678, +96612345678).";

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  navMenu?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open menu");
};

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const validateMobileNumber = (value) => {
  const normalizedValue = value.replace(/[\s()-]/g, "");
  return mobilePattern.test(normalizedValue);
};

const updateMobileError = (input, showError) => {
  const errorId = input.getAttribute("data-mobile-error");
  const errorElement = errorId ? document.getElementById(errorId) : null;

  if (!errorElement) {
    return;
  }

  errorElement.textContent = showError ? mobileHelpText : "";
};

const setMobileValidationState = (input, showError = false) => {
  const value = input.value.trim();

  if (!value) {
    input.setCustomValidity("");
    input.classList.remove("is-valid", "is-invalid");
    updateMobileError(input, false);
    return;
  }

  const isValid = validateMobileNumber(value);

  input.setCustomValidity(isValid ? "" : mobileHelpText);
  input.classList.toggle("is-valid", isValid);
  input.classList.toggle("is-invalid", !isValid);
  updateMobileError(input, showError && !isValid);
};

const bindMobileValidation = () => {
  mobileInputs.forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.addEventListener("input", () => setMobileValidationState(input, true));
    input.addEventListener("blur", () => setMobileValidationState(input, true));
  });
};

const clearMobileValidationState = (form) => {
  const formMobileInputs = form.querySelectorAll("[data-mobile-input]");

  formMobileInputs.forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.setCustomValidity("");
    input.classList.remove("is-valid", "is-invalid");
    updateMobileError(input, false);
  });
};

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("is-open");

  document.body.classList.toggle("menu-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navMenu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const packageName = button.getAttribute("data-package") || "";
    const destination = packageName.split(" ")[0];

    if (destinationSelect) {
      const matchingOption = Array.from(destinationSelect.options).find((option) =>
        packageName.toLowerCase().includes(option.value.toLowerCase())
      );

      destinationSelect.value = matchingOption?.value || destinationSelect.value;
    }

    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });

    if (formStatus) {
      formStatus.textContent = `${packageName} selected. Add your details and send the request.`;
    }
  });
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!(bookingForm instanceof HTMLFormElement) || !bookingForm.checkValidity()) {
    bookingForm?.reportValidity();
    return;
  }

  const formData = new FormData(bookingForm);
  const name = String(formData.get("name") || "Traveler").trim();
  const destination = String(formData.get("destination") || "your trip").trim();

  if (formStatus) {
    formStatus.textContent = `Thank you, ${name}. We received your ${destination} request and will contact you soon.`;
  }

  bookingForm.reset();
  clearMobileValidationState(bookingForm);
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!(contactForm instanceof HTMLFormElement) || !contactForm.checkValidity()) {
    contactForm?.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "Traveler").trim();
  const service = String(formData.get("service") || "travel").trim();

  if (contactStatus) {
    contactStatus.textContent = `Thanks, ${name}. Your ${service} request is ready for the Sohanur Travel team.`;
  }

  contactForm.reset();
  clearMobileValidationState(contactForm);
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});

updateHeader();
bindMobileValidation();
