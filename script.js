const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const bookingForm = document.querySelector("[data-booking-form]");
const destinationSelect = document.querySelector("[data-destination-select]");
const formStatus = document.querySelector("[data-form-status]");
const packageButtons = document.querySelectorAll("[data-package]");

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  navMenu?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open menu");
};

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
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
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});

updateHeader();
