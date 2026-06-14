const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const message = String(formData.get("message") || "").trim();

    formMessage.className = "form-message";

    if (!name || !phone || !service || !message) {
      formMessage.textContent = "Please fill name, mobile number, service, and project details.";
      formMessage.classList.add("error");
      return;
    }

    if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
      formMessage.textContent = "Please enter a valid mobile number.";
      formMessage.classList.add("error");
      return;
    }

    formMessage.textContent = "Thank you. Your inquiry is ready. Backend email saving will be added in the next step.";
    formMessage.classList.add("success");
    contactForm.reset();
  });
}
