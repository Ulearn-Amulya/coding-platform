import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const envPath = new URL("../.env.local", import.meta.url);

function loadEnv(path) {
  const text = readFileSync(path, "utf8");
  const values = new Map();

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    values.set(trimmed.slice(0, separator).trim(), trimmed.slice(separator + 1));
  }

  return values;
}

function cleanupIssue(raw) {
  const issues = [];
  if (raw !== raw.trim()) issues.push("whitespace");
  if (/^["']/.test(raw.trim()) || /["']$/.test(raw.trim())) issues.push("quotes");
  return issues;
}

function classifyUrl(raw) {
  if (raw == null) return "missing";
  if (raw.trim() === "") return "empty";
  if (raw.includes("your-project-id")) return "placeholder";
  const issues = cleanupIssue(raw);
  if (issues.length > 0) return `needs-cleanup:${issues.join("+")}`;

  let url;
  try {
    url = new URL(raw);
  } catch {
    return "invalid";
  }

  if (url.protocol !== "https:") return "not-https";
  if (!url.hostname.endsWith(".supabase.co")) return "unexpected-host";
  return "ok";
}

function classifyKey(raw) {
  if (raw == null) return "missing";
  if (raw.trim() === "") return "empty";
  if (raw.includes("your-publishable-key")) return "placeholder";
  const issues = cleanupIssue(raw);
  if (issues.length > 0) return `needs-cleanup:${issues.join("+")}`;
  if (raw.startsWith("sb_secret_")) return "secret-key";
  if (raw.startsWith("sb_publishable_")) return "publishable";
  if (raw.startsWith("eyJ")) return "legacy-anon";
  return "unrecognized";
}

function sanitize(message, secrets) {
  let safe = message;
  for (const secret of secrets) {
    if (secret) safe = safe.split(secret).join("[redacted]");
  }
  return safe.replace(/https?:\/\/\S+/g, "[redacted-url]");
}

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

let values;
try {
  values = loadEnv(envPath);
} catch {
  console.log("CONFIG: .env.local could not be read");
  process.exit(1);
}

const url = values.get("NEXT_PUBLIC_SUPABASE_URL");
const key = values.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const urlStatus = classifyUrl(url);
const keyStatus = classifyKey(key);

console.log(`URL: ${urlStatus}`);
console.log(`KEY: ${keyStatus}`);

const missingNames = required.filter((name) => !values.has(name));
if (missingNames.length > 0) {
  console.log(`MISSING_NAMES: ${missingNames.join(", ")}`);
}

const trimmedUrl = url?.trim();
const trimmedKey = key?.trim();
const trimmedUrlStatus = classifyUrl(trimmedUrl);
const trimmedKeyStatus = classifyKey(trimmedKey);
const configReady = urlStatus === "ok" && keyStatus === "publishable";

console.log(configReady ? "CONFIG: ready" : "CONFIG: not ready");

if (trimmedUrlStatus !== "ok" || trimmedKeyStatus !== "publishable") {
  console.log("CONNECTION: skipped");
  process.exit(1);
}

if (!configReady) {
  console.log("NOTE: connection probe uses trimmed values; the app client does not trim them");
}

const supabase = createClient(trimmedUrl, trimmedKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.auth.getUser();
const safeMessage = sanitize(error?.message ?? "", [url, key, trimmedUrl, trimmedKey]);

if (!error || error.name === "AuthSessionMissingError" || /session missing/i.test(safeMessage)) {
  console.log("CONNECTION: ok");
  process.exit(configReady ? 0 : 1);
}

console.log(`CONNECTION: failed (${error.status ?? "no-status"}) ${safeMessage}`);
process.exit(1);
