const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const files = {
  html: readFileSync(join(root, "index.html"), "utf8"),
  js: readFileSync(join(root, "src", "app.js"), "utf8"),
  css: readFileSync(join(root, "src", "styles.css"), "utf8"),
};

const expectations = [
  ["software title", files.html.includes("RoboticAPI Recharge Software")],
  ["login form", files.html.includes('id="loginForm"') && files.js.includes("function login")],
  ["customer signup form", files.html.includes('id="signupForm"') && files.js.includes("function signup")],
  ["admin dashboard", files.html.includes('id="adminDashboard"') && files.js.includes("renderAdmin")],
  ["client dashboard", files.html.includes('id="clientDashboard"') && files.js.includes("renderClient")],
  ["wallet handling", files.html.includes("Wallet") && files.js.includes("company.wallet")],
  ["Airtel Lapu support", files.html.includes("Airtel Lapu SIM") && files.js.includes("Airtel Lapu SIM")],
  ["Vi Lapu support", files.html.includes("Vi Lapu SIM") && files.js.includes("Vi Lapu SIM")],
  ["BSNL Lapu support", files.html.includes("BSNL Lapu SIM") && files.js.includes("BSNL Lapu SIM")],
  ["DTH Lapu support", files.html.includes("Tata Play Lapu") && files.html.includes("Dish TV Lapu")],
  ["company API onboarding", files.html.includes("Generate API Key") && files.js.includes("randomApiKey")],
  ["recharge endpoint docs", files.html.includes("/api/v1/recharge")],
  ["status endpoint docs", files.html.includes("/api/v1/recharge/status")],
  ["mobile responsive styles", files.css.includes("@media (max-width: 820px)")],
];

const failures = expectations.filter(([, passed]) => !passed);

if (failures.length) {
  console.error("Smoke test failed:");
  for (const [name] of failures) {
    console.error(`- Missing ${name}`);
  }
  process.exit(1);
}

console.log(`Smoke test passed (${expectations.length} checks).`);
