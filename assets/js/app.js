const api = {
  async request(path, options = {}) {
    const response = await fetch(path, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok || body.ok === false) {
      const message = body.error || body.message || "Request failed. Please try again.";
      const error = new Error(message);
      error.details = body.errors || {};
      throw error;
    }

    return body;
  },
};

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function formToJSON(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setFormStatus(form, message, type = "info") {
  const status = qs("[data-form-status]", form);
  if (!status) return;
  status.textContent = message;
  status.dataset.type = type;
}

function bindLeadForms() {
  qsa("[data-lead-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setFormStatus(form, "Sending your request...");

      try {
        const payload = formToJSON(form);
        const result = await api.request("api/leads.php", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        form.reset();
        setFormStatus(form, result.message, "success");
      } catch (error) {
        setFormStatus(form, error.message, "error");
      }
    });
  });
}

async function loadCatalog() {
  const serviceGrid = qs("[data-service-grid]");
  const planGrid = qs("[data-plan-grid]");

  if (!serviceGrid && !planGrid) return;

  try {
    const { data } = await api.request("api/catalog.php");

    if (serviceGrid) {
      serviceGrid.innerHTML = data.services
        .map(
          (service) => `
            <article class="service-card" id="${service.id}">
              <div class="service-icon">${escapeHTML(service.name.charAt(0))}</div>
              <h3>${escapeHTML(service.name)}</h3>
              <p>${escapeHTML(service.headline)}</p>
              <ul>
                ${service.features.map((feature) => `<li>${escapeHTML(feature)}</li>`).join("")}
              </ul>
            </article>
          `
        )
        .join("");
    }

    if (planGrid) {
      planGrid.innerHTML = data.plans
        .map(
          (plan) => `
            <article class="plan-card">
              <span>${escapeHTML(plan.bestFor)}</span>
              <h3>${escapeHTML(plan.name)}</h3>
              <ul>
                ${plan.includes.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
              </ul>
            </article>
          `
        )
        .join("");
    }
  } catch (error) {
    const target = serviceGrid || planGrid;
    target.innerHTML = `<p class="notice error">${error.message}</p>`;
  }
}

function bindRechargeDemo() {
  const form = qs("[data-recharge-form]");
  const receipt = qs("[data-recharge-receipt]");
  if (!form || !receipt) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormStatus(form, "Generating demo transaction...");

    try {
      const result = await api.request("../api/recharge-demo.php", {
        method: "POST",
        body: JSON.stringify(formToJSON(form)),
      });

      receipt.hidden = false;
      receipt.innerHTML = `
        <h3>Demo transaction created</h3>
        <dl>
          <div><dt>Reference</dt><dd>${escapeHTML(result.data.reference)}</dd></div>
          <div><dt>Status</dt><dd>${escapeHTML(result.data.status)}</dd></div>
          <div><dt>Commission</dt><dd>Rs. ${escapeHTML(result.data.commission)}</dd></div>
          <div><dt>Wallet debit</dt><dd>Rs. ${escapeHTML(result.data.walletDebit)}</dd></div>
        </dl>
        <p>${escapeHTML(result.message)}</p>
      `;
      form.reset();
      setFormStatus(form, "Demo saved in admin leads.", "success");
    } catch (error) {
      setFormStatus(form, error.message, "error");
    }
  });
}

function bindWhiteLabelQuote() {
  const form = qs("[data-whitelabel-form]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormStatus(form, "Preparing your white-label request...");

    try {
      const result = await api.request("../api/quote.php", {
        method: "POST",
        body: JSON.stringify(formToJSON(form)),
      });
      form.reset();
      setFormStatus(form, result.message, "success");
    } catch (error) {
      setFormStatus(form, error.message, "error");
    }
  });
}

function bindAdminDashboard() {
  const adminRoot = qs("[data-admin-root]");
  if (!adminRoot) return;

  const tokenInput = qs("[data-admin-token]");
  const loadButton = qs("[data-load-leads]");
  const tableBody = qs("[data-leads-table]");
  const summary = qs("[data-admin-summary]");
  const savedToken = localStorage.getItem("roboticApiAdminToken");

  if (savedToken) tokenInput.value = savedToken;

  loadButton.addEventListener("click", async () => {
    const token = tokenInput.value.trim();
    if (!token) {
      summary.textContent = "Enter your admin token from api/config.php.";
      return;
    }

    localStorage.setItem("roboticApiAdminToken", token);
    summary.textContent = "Loading leads...";

    try {
      const result = await api.request("../api/leads.php", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const leads = result.data;
      summary.textContent = `${leads.length} lead${leads.length === 1 ? "" : "s"} found.`;
      tableBody.innerHTML = leads
        .map(
          (lead) => `
            <tr>
              <td><strong>${escapeHTML(lead.name)}</strong><small>${escapeHTML(lead.company || "No company")}</small></td>
              <td>${escapeHTML(lead.phone)}<small>${escapeHTML(lead.email || "")}</small></td>
              <td>${escapeHTML(lead.service)}</td>
              <td>${escapeHTML(lead.message)}</td>
              <td>${escapeHTML(new Date(lead.createdAt).toLocaleString())}</td>
            </tr>
          `
        )
        .join("");
    } catch (error) {
      summary.textContent = error.message;
      tableBody.innerHTML = "";
    }
  });
}

function bindMobileNav() {
  const toggle = qs("[data-menu-toggle]");
  const nav = qs("[data-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindMobileNav();
  bindLeadForms();
  bindRechargeDemo();
  bindWhiteLabelQuote();
  bindAdminDashboard();
  loadCatalog();
});
