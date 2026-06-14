const STORAGE_KEY = "rechargehub-demo-state";

const defaultState = {
  lapuLines: [
    {
      id: "LP1001",
      provider: "Airtel Lapu SIM",
      type: "Mobile Recharge",
      number: "9876500011",
      balance: 18650,
      limit: 50000,
      circle: "All India",
      status: "Active",
    },
    {
      id: "LP1002",
      provider: "Vi Lapu SIM",
      type: "Mobile Recharge",
      number: "9876500022",
      balance: 7200,
      limit: 30000,
      circle: "UP East",
      status: "Active",
    },
    {
      id: "LP1003",
      provider: "BSNL Lapu SIM",
      type: "Mobile Recharge",
      number: "9876500033",
      balance: 940,
      limit: 15000,
      circle: "Bihar",
      status: "Low Balance",
    },
    {
      id: "LP1004",
      provider: "Tata Play Lapu",
      type: "DTH Recharge",
      number: "9876500044",
      balance: 12320,
      limit: 25000,
      circle: "All India",
      status: "Active",
    },
  ],
  companies: [
    {
      id: "CP1001",
      name: "Metro Multi Recharge",
      email: "owner@metrorecharge.example",
      callbackUrl: "https://metrorecharge.example/api/callback",
      ipWhitelist: "103.10.20.30",
      apiKey: "rh_live_metro_7D92KQ",
      status: "Active",
    },
    {
      id: "CP1002",
      name: "FastPay Retailer Panel",
      email: "admin@fastpay.example",
      callbackUrl: "https://fastpay.example/recharge/status",
      ipWhitelist: "103.10.20.31",
      apiKey: "rh_live_fastpay_4NQ8PT",
      status: "Active",
    },
  ],
  orders: [
    {
      id: "RH10001",
      mobile: "9876543210",
      operator: "Airtel Lapu SIM",
      amount: 199,
      company: "Metro Multi Recharge",
      routedBy: "9876500011",
      status: "Success",
    },
    {
      id: "RH10002",
      mobile: "3029988011",
      operator: "Tata Play Lapu",
      amount: 399,
      company: "FastPay Retailer Panel",
      routedBy: "9876500044",
      status: "Pending",
    },
  ],
};

let state = loadState();
let searchTerm = "";

const titleMap = {
  dashboard: "Dashboard",
  lapu: "Lapu Management",
  companies: "Companies",
  orders: "Recharge Orders",
  reports: "Reports",
  settings: "Settings",
  plans: "Plans",
  api: "API Documentation",
  features: "Features",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function loadState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : structuredClone(defaultState);
  } catch (error) {
    console.warn("Unable to load saved demo state", error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusClass(status) {
  const normalized = status.toLowerCase();
  if (normalized.includes("success") || normalized.includes("active")) return "success";
  if (normalized.includes("pending")) return "pending";
  if (normalized.includes("low") || normalized.includes("failed")) return "low";
  return "";
}

function formatCurrency(amount) {
  return currencyFormatter.format(Number(amount || 0));
}

function matchesSearch(row) {
  if (!searchTerm) return true;
  return Object.values(row).join(" ").toLowerCase().includes(searchTerm);
}

function renderStats() {
  const activeLines = state.lapuLines.filter((line) => line.status === "Active").length;
  const totalBalance = state.lapuLines.reduce((total, line) => total + Number(line.balance), 0);
  const successOrders = state.orders.filter((order) => order.status === "Success").length;
  const successRate = state.orders.length
    ? Math.round((successOrders / state.orders.length) * 100)
    : 0;

  const stats = [
    { label: "Integrated Companies", value: state.companies.length, hint: "API customers" },
    { label: "Active Lapu Lines", value: activeLines, hint: "Mobile and DTH routes" },
    { label: "Available Balance", value: formatCurrency(totalBalance), hint: "Across all Lapu SIMs" },
    { label: "Success Rate", value: `${successRate}%`, hint: "Demo transaction health" },
  ];

  document.getElementById("statsGrid").innerHTML = stats
    .map(
      (stat) => `
        <article class="stat-card">
          <span>${escapeHtml(stat.label)}</span>
          <strong>${escapeHtml(stat.value)}</strong>
          <span>${escapeHtml(stat.hint)}</span>
        </article>
      `,
    )
    .join("");
}

function renderLapuList() {
  const rows = state.lapuLines.filter(matchesSearch);
  document.getElementById("lapuTable").innerHTML =
    rows
      .map(
        (line) => `
          <tr>
            <td><strong>${escapeHtml(line.provider)}</strong><br /><small>${escapeHtml(line.id)}</small></td>
            <td>${escapeHtml(line.number)}</td>
            <td>${escapeHtml(line.type)}</td>
            <td>${escapeHtml(line.circle)}</td>
            <td>${formatCurrency(line.balance)}</td>
            <td>${formatCurrency(line.limit)}</td>
            <td><span class="status-pill ${statusClass(line.status)}">${escapeHtml(line.status)}</span></td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="7">No Lapu lines match your search.</td></tr>`;

  document.getElementById("activeLapuList").innerHTML = state.lapuLines
    .slice()
    .sort((first, second) => Number(second.balance) - Number(first.balance))
    .slice(0, 5)
    .map(
      (line) => `
        <div class="compact-row">
          <div>
            <strong>${escapeHtml(line.provider)}</strong>
            <small>${escapeHtml(line.number)} • ${escapeHtml(line.circle)}</small>
          </div>
          <span class="status-pill ${statusClass(line.status)}">${formatCurrency(line.balance)}</span>
        </div>
      `,
    )
    .join("");
}

function renderCompanyList() {
  const rows = state.companies.filter(matchesSearch);
  document.getElementById("companyTable").innerHTML =
    rows
      .map(
        (company) => `
          <tr>
            <td><strong>${escapeHtml(company.name)}</strong><br /><small>${escapeHtml(company.email)}</small></td>
            <td><code>${escapeHtml(company.apiKey)}</code><br /><small>IP: ${escapeHtml(company.ipWhitelist)}</small></td>
            <td>${escapeHtml(company.callbackUrl)}</td>
            <td><span class="status-pill ${statusClass(company.status)}">${escapeHtml(company.status)}</span></td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="4">No companies match your search.</td></tr>`;
}

function renderOrderList() {
  const rows = state.orders.filter(matchesSearch);
  document.getElementById("orderTable").innerHTML =
    rows
      .map(
        (order) => `
          <tr>
            <td><strong>${escapeHtml(order.id)}</strong></td>
            <td>${escapeHtml(order.mobile)}</td>
            <td>${escapeHtml(order.operator)}</td>
            <td>${formatCurrency(order.amount)}</td>
            <td>${escapeHtml(order.company)}</td>
            <td>${escapeHtml(order.routedBy)}</td>
            <td><span class="status-pill ${statusClass(order.status)}">${escapeHtml(order.status)}</span></td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="7">No orders match your search.</td></tr>`;
}

function populateSelects() {
  const operatorSelect = document.getElementById("rechargeOperator");
  const companySelect = document.getElementById("rechargeCompany");

  operatorSelect.innerHTML = state.lapuLines
    .map((line) => `<option value="${escapeHtml(line.provider)}">${escapeHtml(line.provider)}</option>`)
    .join("");

  companySelect.innerHTML = state.companies
    .map((company) => `<option value="${escapeHtml(company.name)}">${escapeHtml(company.name)}</option>`)
    .join("");
}

function renderAll() {
  renderStats();
  renderLapuList();
  renderCompanyList();
  renderOrderList();
  populateSelects();
}

function switchView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.view === viewId);
  });

  document.getElementById("pageTitle").textContent = titleMap[viewId] || "Dashboard";
  closeSidebar();
}

function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function nextId(prefix, collection) {
  const highestId = collection.reduce((highest, item) => {
    const numericId = Number(String(item.id).replace(/\D/g, ""));
    return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest;
  }, 1000);
  return `${prefix}${highestId + 1}`;
}

function randomApiKey(companyName) {
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `rh_live_${slug || "company"}_${token}`;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

function addLapuLine(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const balance = Number(formData.get("balance"));
  const status = balance < 1000 ? "Low Balance" : "Active";

  state.lapuLines.unshift({
    id: nextId("LP", state.lapuLines),
    provider: formData.get("provider"),
    type: formData.get("type"),
    number: formData.get("number"),
    balance,
    limit: Number(formData.get("limit")),
    circle: formData.get("circle"),
    status,
  });

  saveState();
  renderAll();
  event.currentTarget.reset();
  showToast("Lapu line saved and added to recharge routing.");
}

function addCompany(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const companyName = formData.get("name");

  state.companies.unshift({
    id: nextId("CP", state.companies),
    name: companyName,
    email: formData.get("email"),
    callbackUrl: formData.get("callbackUrl"),
    ipWhitelist: formData.get("ipWhitelist"),
    apiKey: randomApiKey(companyName),
    status: "Active",
  });

  saveState();
  renderAll();
  event.currentTarget.reset();
  showToast("Company API key generated. Share the API documentation with this partner.");
}

function createRechargeOrder(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const operator = formData.get("operator");
  const amount = Number(formData.get("amount"));
  const line = state.lapuLines.find((lapuLine) => lapuLine.provider === operator);

  if (!line) {
    showToast("No active Lapu route found for this operator.");
    return;
  }

  const hasBalance = Number(line.balance) >= amount;
  const status = hasBalance ? "Success" : "Pending";
  if (hasBalance) {
    line.balance = Number(line.balance) - amount;
    line.status = line.balance < 1000 ? "Low Balance" : "Active";
  }

  state.orders.unshift({
    id: nextId("RH", state.orders),
    mobile: formData.get("mobile"),
    operator,
    amount,
    company: formData.get("company"),
    routedBy: line.number,
    status,
  });

  saveState();
  renderAll();
  event.currentTarget.reset();
  showToast(
    hasBalance
      ? "Recharge order completed through the selected Lapu route."
      : "Recharge order is pending because the selected Lapu balance is low.",
  );
}

function resetDemoData() {
  state = structuredClone(defaultState);
  saveState();
  renderAll();
  showToast("Demo data restored.");
}

document.addEventListener("click", (event) => {
  const navTarget = event.target.closest("[data-view]");
  if (navTarget) {
    switchView(navTarget.dataset.view);
  }

  const jumpTarget = event.target.closest("[data-jump]");
  if (jumpTarget) {
    switchView(jumpTarget.dataset.jump);
  }
});

document.getElementById("openMenu").addEventListener("click", openSidebar);
document.getElementById("closeMenu").addEventListener("click", closeSidebar);
document.getElementById("overlay").addEventListener("click", closeSidebar);
document.getElementById("lapuForm").addEventListener("submit", addLapuLine);
document.getElementById("companyForm").addEventListener("submit", addCompany);
document.getElementById("rechargeForm").addEventListener("submit", createRechargeOrder);
document.getElementById("resetDemoData").addEventListener("click", resetDemoData);
document.getElementById("globalSearch").addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderAll();
});

renderAll();
