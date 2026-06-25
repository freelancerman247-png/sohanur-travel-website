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
const indianMobilePattern = /^[6-9]\d{9}$/;
const saudiMobilePattern = /^(?:05\d{8}|9665\d{8}|\+9665\d{8})$/;
const mobileValidationMessage =
  "Enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9) or a Saudi mobile number in 05XXXXXXXX, 9665XXXXXXXX, or +9665XXXXXXXX format.";

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  navMenu?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open menu");
};

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const normalizeMobileNumber = (value) => value.trim().replace(/[\s-]/g, "");

const getMobileErrorElement = (input) => {
  const errorId = input.getAttribute("data-mobile-error");
  return errorId ? document.getElementById(errorId) : null;
};

const setMobileFieldState = (input, message) => {
  input.setCustomValidity(message);
  input.classList.toggle("is-invalid", Boolean(message));
  input.classList.toggle("is-valid", !message && input.value.trim() !== "");
  input.setAttribute("aria-invalid", message ? "true" : "false");

  const errorElement = getMobileErrorElement(input);

  if (errorElement) {
    errorElement.textContent = message;
  }
};

const validateMobileNumber = (input, { showRequired = false } = {}) => {
  const normalizedValue = normalizeMobileNumber(input.value);

  if (!normalizedValue) {
    setMobileFieldState(input, showRequired ? "Please enter your mobile number." : "");
    return !showRequired;
  }

  const isValidNumber =
    indianMobilePattern.test(normalizedValue) || saudiMobilePattern.test(normalizedValue);

  setMobileFieldState(input, isValidNumber ? "" : mobileValidationMessage);
  return isValidNumber;
};

const validateFormMobileNumbers = (form) =>
  Array.from(form.querySelectorAll("[data-mobile-input]")).every(
    (input) => input instanceof HTMLInputElement && validateMobileNumber(input, { showRequired: true })
  );

const resetFormMobileValidation = (form) => {
  form.querySelectorAll("[data-mobile-input]").forEach((input) => {
    if (input instanceof HTMLInputElement) {
      setMobileFieldState(input, "");
    }
  });
};

mobileInputs.forEach((input) => {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  input.addEventListener("input", () => {
    validateMobileNumber(input);
  });

  input.addEventListener("blur", () => {
    validateMobileNumber(input, { showRequired: true });
  });
});

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

  if (
    !(bookingForm instanceof HTMLFormElement) ||
    !validateFormMobileNumbers(bookingForm) ||
    !bookingForm.checkValidity()
  ) {
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
  resetFormMobileValidation(bookingForm);
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (
    !(contactForm instanceof HTMLFormElement) ||
    !validateFormMobileNumbers(contactForm) ||
    !contactForm.checkValidity()
  ) {
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
  resetFormMobileValidation(contactForm);
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});

updateHeader();
