const STORAGE_KEY = "roboticapi-state";
const SESSION_KEY = "roboticapi-session";

const defaultState = {
  users: [
    {
      id: "USR1001",
      role: "admin",
      name: "Super Admin",
      company: "RoboticAPI",
      email: "admin@roboticapi.in",
      mobile: "9000000000",
      password: "admin123",
    },
  ],
  lapuLines: [
    { id: "LP1001", provider: "Airtel Lapu SIM", type: "Mobile Recharge", number: "9876500011", balance: 18650, limit: 50000, circle: "All India", status: "Active" },
    { id: "LP1002", provider: "Vi Lapu SIM", type: "Mobile Recharge", number: "9876500022", balance: 7200, limit: 30000, circle: "UP East", status: "Active" },
    { id: "LP1003", provider: "BSNL Lapu SIM", type: "Mobile Recharge", number: "9876500033", balance: 940, limit: 15000, circle: "Bihar", status: "Low Balance" },
    { id: "LP1004", provider: "Tata Play Lapu", type: "DTH Recharge", number: "9876500044", balance: 12320, limit: 25000, circle: "All India", status: "Active" },
  ],
  companies: [
    {
      id: "CP1001",
      userId: null,
      name: "Metro Multi Recharge",
      owner: "Metro Owner",
      email: "owner@metrorecharge.example",
      mobile: "9876543210",
      callbackUrl: "https://metrorecharge.example/api/callback",
      ipWhitelist: "103.10.20.30",
      apiKey: "rh_live_metro_7D92KQ",
      wallet: 25000,
      status: "Active",
    },
    {
      id: "CP1002",
      userId: null,
      name: "FastPay Retailer Panel",
      owner: "FastPay Admin",
      email: "admin@fastpay.example",
      mobile: "9876501234",
      callbackUrl: "https://fastpay.example/recharge/status",
      ipWhitelist: "103.10.20.31",
      apiKey: "rh_live_fastpay_4NQ8PT",
      wallet: 14350,
      status: "Active",
    },
  ],
  orders: [
    { id: "RH10001", mobile: "9876543210", operator: "Airtel Lapu SIM", amount: 199, company: "Metro Multi Recharge", routedBy: "9876500011", status: "Success" },
    { id: "RH10002", mobile: "3029988011", operator: "Tata Play Lapu", amount: 399, company: "FastPay Retailer Panel", routedBy: "9876500044", status: "Pending" },
  ],
};

let state = loadState();
let session = loadSession();
let adminSearchTerm = "";

const adminTitles = {
  adminDashboard: "Dashboard",
  lapu: "Lapu SIM / DTH",
  companies: "Clients",
  orders: "Recharge Orders",
  reports: "Reports",
  apiDocs: "API Documentation",
};

const clientTitles = {
  clientDashboard: "Dashboard",
  clientRecharge: "New Recharge",
  clientOrders: "My Orders",
  clientApi: "My API",
  clientProfile: "Profile",
};

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(defaultState);
    const parsed = JSON.parse(saved);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      users: parsed.users?.length ? parsed.users : structuredClone(defaultState.users),
    };
  } catch (error) {
    console.warn("State reset because saved data was invalid.", error);
    return structuredClone(defaultState);
  }
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveSession(nextSession) {
  session = nextSession;
  if (nextSession) localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  else localStorage.removeItem(SESSION_KEY);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(value) {
  return money.format(Number(value || 0));
}

function statusClass(status) {
  const normalized = String(status).toLowerCase();
  if (normalized.includes("success") || normalized.includes("active")) return "success";
  if (normalized.includes("pending")) return "pending";
  if (normalized.includes("low") || normalized.includes("failed")) return "low";
  return "";
}

function nextId(prefix, collection) {
  const highest = collection.reduce((max, item) => {
    const numeric = Number(String(item.id).replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 1000);
  return `${prefix}${highest + 1}`;
}

function randomApiKey(companyName) {
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const token = Math.random().toString(36).slice(2, 9).toUpperCase();
  return `rh_live_${slug || "client"}_${token}`;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 3500);
}

function currentUser() {
  return session ? state.users.find((user) => user.id === session.userId) : null;
}

function companyForUser(user = currentUser()) {
  if (!user) return null;
  return state.companies.find((company) => company.userId === user.id || company.email === user.email);
}

function setAuthTab(tabName) {
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authTab === tabName);
  });
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.toggle("active", form.id === `${tabName}Form`);
  });
}

function showShell() {
  const user = currentUser();
  document.getElementById("authShell").classList.toggle("hidden", Boolean(user));
  document.getElementById("adminApp").classList.toggle("hidden", user?.role !== "admin");
  document.getElementById("clientApp").classList.toggle("hidden", user?.role !== "client");
  if (user?.role === "admin") renderAdmin();
  if (user?.role === "client") renderClient();
}

function login(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = String(formData.get("email")).trim().toLowerCase();
  const password = String(formData.get("password"));
  const user = state.users.find(
    (candidate) => candidate.email.toLowerCase() === email && candidate.password === password,
  );

  if (!user) {
    showToast("Invalid login details. Try admin@roboticapi.in / admin123 or signup as customer.");
    return;
  }

  saveSession({ userId: user.id, role: user.role });
  event.currentTarget.reset();
  showShell();
  showToast(`Welcome ${user.name || user.company}`);
}

function signup(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = String(formData.get("email")).trim().toLowerCase();
  if (state.users.some((user) => user.email.toLowerCase() === email)) {
    showToast("This email already has an account. Please login.");
    return;
  }

  const user = {
    id: nextId("USR", state.users),
    role: "client",
    name: formData.get("owner"),
    company: formData.get("company"),
    email,
    mobile: formData.get("mobile"),
    password: formData.get("password"),
  };

  const company = {
    id: nextId("CP", state.companies),
    userId: user.id,
    name: user.company,
    owner: user.name,
    email: user.email,
    mobile: user.mobile,
    callbackUrl: "",
    ipWhitelist: "Pending",
    apiKey: randomApiKey(user.company),
    wallet: 1000,
    status: "Active",
  };

  state.users.push(user);
  state.companies.unshift(company);
  saveState();
  saveSession({ userId: user.id, role: user.role });
  event.currentTarget.reset();
  showShell();
  showToast("Customer account created. Your client dashboard is ready.");
}

function logout() {
  saveSession(null);
  showShell();
  showToast("Logged out successfully.");
}

function matchesAdminSearch(row) {
  if (!adminSearchTerm) return true;
  return Object.values(row).join(" ").toLowerCase().includes(adminSearchTerm);
}

function renderStats(targetId, stats) {
  document.getElementById(targetId).innerHTML = stats
    .map(
      (stat) => `
        <article class="stat-card">
          <span>${escapeHtml(stat.label)}</span>
          <strong>${escapeHtml(stat.value)}</strong>
          <small>${escapeHtml(stat.hint)}</small>
        </article>
      `,
    )
    .join("");
}

function renderAdminStats() {
  const totalBalance = state.lapuLines.reduce((sum, line) => sum + Number(line.balance), 0);
  const walletBalance = state.companies.reduce((sum, company) => sum + Number(company.wallet), 0);
  const successOrders = state.orders.filter((order) => order.status === "Success").length;
  const lowLapu = state.lapuLines.filter((line) => line.status === "Low Balance").length;
  const stats = [
    { label: "Client Companies", value: state.companies.length, hint: "Registered API customers" },
    { label: "Lapu Balance", value: formatCurrency(totalBalance), hint: "Mobile and DTH inventory" },
    { label: "Client Wallets", value: formatCurrency(walletBalance), hint: "Total customer balance" },
    { label: "Success Orders", value: successOrders, hint: `${lowLapu} low balance Lapu alert(s)` },
  ];
  renderStats("adminStats", stats);
  renderStats("reportStats", stats);
}

function renderLapuTables() {
  const rows = state.lapuLines.filter(matchesAdminSearch);
  document.getElementById("lapuTable").innerHTML =
    rows
      .map(
        (line) => `
          <tr>
            <td><strong>${escapeHtml(line.provider)}</strong><br><small>${escapeHtml(line.id)}</small></td>
            <td>${escapeHtml(line.number)}</td>
            <td>${escapeHtml(line.type)}</td>
            <td>${escapeHtml(line.circle)}</td>
            <td>${formatCurrency(line.balance)}</td>
            <td>${formatCurrency(line.limit)}</td>
            <td><span class="status-pill ${statusClass(line.status)}">${escapeHtml(line.status)}</span></td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="7">No Lapu route found.</td></tr>`;

  document.getElementById("lapuHealth").innerHTML = state.lapuLines
    .slice()
    .sort((a, b) => Number(a.balance) - Number(b.balance))
    .slice(0, 5)
    .map(
      (line) => `
        <div class="compact-row">
          <div><strong>${escapeHtml(line.provider)}</strong><small>${escapeHtml(line.number)} - ${escapeHtml(line.circle)}</small></div>
          <span class="status-pill ${statusClass(line.status)}">${formatCurrency(line.balance)}</span>
        </div>
      `,
    )
    .join("");
}

function renderCompanies() {
  const rows = state.companies.filter(matchesAdminSearch);
  document.getElementById("companyTable").innerHTML =
    rows
      .map(
        (company) => `
          <tr>
            <td><strong>${escapeHtml(company.name)}</strong><br><small>${escapeHtml(company.email)} | ${escapeHtml(company.mobile || "")}</small></td>
            <td><code>${escapeHtml(company.apiKey)}</code></td>
            <td>${formatCurrency(company.wallet)}</td>
            <td>${escapeHtml(company.callbackUrl || "Not configured")}</td>
            <td><span class="status-pill ${statusClass(company.status)}">${escapeHtml(company.status)}</span></td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="5">No client found.</td></tr>`;
}

function renderOrders() {
  const rows = state.orders.filter(matchesAdminSearch);
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
      .join("") || `<tr><td colspan="7">No order found.</td></tr>`;
}

function populateAdminSelects() {
  document.getElementById("adminOperator").innerHTML = state.lapuLines
    .map((line) => `<option value="${escapeHtml(line.provider)}">${escapeHtml(line.provider)}</option>`)
    .join("");
  document.getElementById("adminCompany").innerHTML = state.companies
    .map((company) => `<option value="${escapeHtml(company.name)}">${escapeHtml(company.name)}</option>`)
    .join("");
}

function renderAdmin() {
  renderAdminStats();
  renderLapuTables();
  renderCompanies();
  renderOrders();
  populateAdminSelects();
}

function switchAdminView(viewId) {
  document.querySelectorAll("#adminApp .view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll("[data-admin-view]").forEach((link) => link.classList.toggle("active", link.dataset.adminView === viewId));
  document.getElementById("adminTitle").textContent = adminTitles[viewId] || "Dashboard";
}

function switchClientView(viewId) {
  document.querySelectorAll("#clientApp .view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll("[data-client-view]").forEach((link) => link.classList.toggle("active", link.dataset.clientView === viewId));
  document.getElementById("clientTitle").textContent = clientTitles[viewId] || "Dashboard";
}

function addLapu(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const balance = Number(formData.get("balance"));
  state.lapuLines.unshift({
    id: nextId("LP", state.lapuLines),
    provider: formData.get("provider"),
    type: formData.get("type"),
    number: formData.get("number"),
    balance,
    limit: Number(formData.get("limit")),
    circle: formData.get("circle"),
    status: balance < 1000 ? "Low Balance" : "Active",
  });
  saveState();
  renderAdmin();
  event.currentTarget.reset();
  showToast("Lapu route added successfully.");
}

function addCompany(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = formData.get("name");
  const email = String(formData.get("email")).trim().toLowerCase();
  const user = {
    id: nextId("USR", state.users),
    role: "client",
    name,
    company: name,
    email,
    mobile: "",
    password: "client123",
  };
  state.users.push(user);
  state.companies.unshift({
    id: nextId("CP", state.companies),
    userId: user.id,
    name,
    owner: name,
    email,
    mobile: "",
    callbackUrl: formData.get("callbackUrl"),
    ipWhitelist: "Pending",
    apiKey: randomApiKey(name),
    wallet: Number(formData.get("wallet")),
    status: "Active",
  });
  saveState();
  renderAdmin();
  event.currentTarget.reset();
  showToast("Client created. Default demo password is client123.");
}

function routeRecharge({ mobile, operator, amount, companyName }) {
  const company = state.companies.find((candidate) => candidate.name === companyName);
  const line = state.lapuLines.find((candidate) => candidate.provider === operator);
  if (!company || !line) return { ok: false, message: "Company or Lapu route not found." };
  if (Number(company.wallet) < amount) return { ok: false, message: "Client wallet balance is low." };

  const hasLapuBalance = Number(line.balance) >= amount;
  const status = hasLapuBalance ? "Success" : "Pending";
  company.wallet = Number(company.wallet) - amount;
  if (hasLapuBalance) {
    line.balance = Number(line.balance) - amount;
    line.status = line.balance < 1000 ? "Low Balance" : "Active";
  }
  state.orders.unshift({
    id: nextId("RH", state.orders),
    mobile,
    operator,
    amount,
    company: company.name,
    routedBy: line.number,
    status,
  });
  saveState();
  return { ok: true, status };
}

function adminRecharge(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const result = routeRecharge({
    mobile: formData.get("mobile"),
    operator: formData.get("operator"),
    amount: Number(formData.get("amount")),
    companyName: formData.get("company"),
  });
  renderAdmin();
  if (result.ok) event.currentTarget.reset();
  showToast(result.ok ? `Recharge ${result.status}.` : result.message);
}

function renderClient() {
  const user = currentUser();
  const company = companyForUser(user);
  if (!user || !company) return;

  document.getElementById("clientBrand").textContent = company.name;
  document.getElementById("clientNameTop").textContent = user.name;
  document.getElementById("clientWelcome").textContent = `${company.name} Dashboard`;
  document.getElementById("clientWalletAmount").textContent = formatCurrency(company.wallet);
  document.getElementById("clientApiKey").textContent = company.apiKey;

  const myOrders = state.orders.filter((order) => order.company === company.name);
  const success = myOrders.filter((order) => order.status === "Success").length;
  renderStats("clientStats", [
    { label: "Wallet Balance", value: formatCurrency(company.wallet), hint: "Available for recharge" },
    { label: "Total Orders", value: myOrders.length, hint: "All API/manual requests" },
    { label: "Success Orders", value: success, hint: "Completed transactions" },
    { label: "API Status", value: company.status, hint: "Account approval" },
  ]);

  document.getElementById("clientOperator").innerHTML = state.lapuLines
    .map((line) => `<option value="${escapeHtml(line.provider)}">${escapeHtml(line.provider)}</option>`)
    .join("");
  document.getElementById("clientOrderTable").innerHTML =
    myOrders
      .map(
        (order) => `
          <tr>
            <td><strong>${escapeHtml(order.id)}</strong></td>
            <td>${escapeHtml(order.mobile)}</td>
            <td>${escapeHtml(order.operator)}</td>
            <td>${formatCurrency(order.amount)}</td>
            <td>${escapeHtml(order.routedBy)}</td>
            <td><span class="status-pill ${statusClass(order.status)}">${escapeHtml(order.status)}</span></td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="6">No recharge order yet.</td></tr>`;

  document.getElementById("clientProfileDetails").innerHTML = [
    ["Company", company.name],
    ["Owner", company.owner || user.name],
    ["Email", company.email],
    ["Mobile", company.mobile || user.mobile],
    ["Wallet", formatCurrency(company.wallet)],
    ["Callback URL", company.callbackUrl || "Not configured"],
    ["IP Whitelist", company.ipWhitelist],
    ["Status", company.status],
  ]
    .map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
    .join("");
}

function clientRecharge(event) {
  event.preventDefault();
  const company = companyForUser();
  const formData = new FormData(event.currentTarget);
  const result = routeRecharge({
    mobile: formData.get("mobile"),
    operator: formData.get("operator"),
    amount: Number(formData.get("amount")),
    companyName: company.name,
  });
  renderClient();
  renderAdmin();
  if (result.ok) event.currentTarget.reset();
  showToast(result.ok ? `Recharge ${result.status}.` : result.message);
}

function demoTopup() {
  const company = companyForUser();
  company.wallet = Number(company.wallet) + 5000;
  saveState();
  renderClient();
  showToast("Demo wallet top-up added.");
}

function resetDemoData() {
  state = structuredClone(defaultState);
  saveState();
  saveSession(null);
  showShell();
  showToast("Demo data reset. Use admin@roboticapi.in / admin123.");
}

document.addEventListener("click", (event) => {
  const authTab = event.target.closest("[data-auth-tab]");
  if (authTab) setAuthTab(authTab.dataset.authTab);

  const adminLink = event.target.closest("[data-admin-view]");
  if (adminLink) switchAdminView(adminLink.dataset.adminView);

  const adminJump = event.target.closest("[data-admin-jump]");
  if (adminJump) switchAdminView(adminJump.dataset.adminJump);

  const clientLink = event.target.closest("[data-client-view]");
  if (clientLink) switchClientView(clientLink.dataset.clientView);

  const clientJump = event.target.closest("[data-client-jump]");
  if (clientJump) switchClientView(clientJump.dataset.clientJump);

  if (event.target.closest("[data-logout]")) logout();
});

document.getElementById("loginForm").addEventListener("submit", login);
document.getElementById("signupForm").addEventListener("submit", signup);
document.getElementById("lapuForm").addEventListener("submit", addLapu);
document.getElementById("companyForm").addEventListener("submit", addCompany);
document.getElementById("adminRechargeForm").addEventListener("submit", adminRecharge);
document.getElementById("clientRechargeForm").addEventListener("submit", clientRecharge);
document.getElementById("demoTopup").addEventListener("click", demoTopup);
document.getElementById("resetDemo").addEventListener("click", resetDemoData);
document.getElementById("adminSearch").addEventListener("input", (event) => {
  adminSearchTerm = event.target.value.trim().toLowerCase();
  renderAdmin();
});

showShell();
