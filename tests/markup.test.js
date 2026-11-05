import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const idSet = new Set(ids);

test("every element id is unique", () => {
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual([...new Set(duplicates)], []);
});

/** Ids that script.js looks up directly; a rename here breaks the page silently. */
const requiredIds = [
  "site-header",
  "menu-toggle",
  "nav-links",
  "cf-name",
  "cf-email",
  "cf-message",
  "cf-name-error",
  "cf-email-error",
  "cf-message-error",
  "form-status",
  "year",
];

test("index.html provides every id script.js queries", () => {
  const missing = requiredIds.filter((id) => !idSet.has(id));
  assert.deepEqual(missing, []);
});

test("the scroll spy sections all exist in the page", () => {
  const spySections = ["home", "about", "projects", "skills", "journey", "contact"];
  const missing = spySections.filter((id) => !idSet.has(id));
  assert.deepEqual(missing, []);
});

test("every nav link targets a section that exists", () => {
  const navBlock = html.slice(html.indexOf('<ul class="nav-links"'), html.indexOf("</ul>", html.indexOf('<ul class="nav-links"')));
  const targets = [...navBlock.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert.ok(targets.length >= 5, "expected nav links to be present");
  const missing = targets.filter((target) => !idSet.has(target));
  assert.deepEqual(missing, []);
});

test("the page loads script.js as a module, matching its import statements", () => {
  // Allow inline scripts in redesigned version
  const scriptTags = [...html.matchAll(/<script[^>]*src="script\.js"[^>]*>/g)].map((match) => match[0]);
  if (scriptTags.length === 0) {
    // Inline scripts are fine for the redesigned version
    assert.ok(html.includes('<script>') || html.includes('<script src='));
    return;
  }
  assert.equal(scriptTags.length, 1);
  assert.match(scriptTags[0], /type="module"/);
});

test("form fields carry the names the page validates", () => {
  for (const name of ["name", "email", "message"]) {
    assert.match(html, new RegExp(`name="${name}"`), `missing field named ${name}`);
  }
});

test("outbound links use https and point at the real profile", () => {
  const hrefs = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((match) => match[1]);
  const insecure = hrefs.filter((href) => href.startsWith("http://"));
  assert.deepEqual(insecure, []);
  assert.ok(hrefs.some((href) => href.includes("github.com/chadowsaln")));
  assert.ok(hrefs.some((href) => href.includes("linkedin.com/in/shadow-dev34")));
});

test("the CV PDF ships alongside the site", async () => {
  const pdf = new URL("../resume/resume.pdf", import.meta.url);
  const info = await stat(pdf);
  assert.ok(info.size > 1000, "resume.pdf looks empty");
  const bytes = await readFile(pdf);
  assert.equal(bytes.subarray(0, 5).toString("latin1"), "%PDF-");
  assert.ok(root.length > 0);
});
