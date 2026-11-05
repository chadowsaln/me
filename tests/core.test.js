import test from "node:test";
import assert from "node:assert/strict";

import {
  FIELD_VALIDATORS,
  MIN_MESSAGE_LENGTH,
  SPY_PROBE_RATIO,
  computeActiveSection,
  validateEmail,
  validateMessage,
  validateName,
} from "../lib/core.js";

test("validateName accepts plausible names", () => {
  assert.equal(validateName("Ada Lovelace"), "");
  assert.equal(validateName("  Idoumou  "), "");
  assert.equal(validateName("Li"), ""); // two characters is the minimum
});

test("validateName rejects empty and one-character input", () => {
  assert.equal(validateName(""), "Please enter your name.");
  assert.equal(validateName("   "), "Please enter your name.");
  assert.equal(validateName("A"), "Name must be at least 2 characters.");
});

test("validateName treats missing input as empty rather than throwing", () => {
  assert.equal(validateName(undefined), "Please enter your name.");
  assert.equal(validateName(null), "Please enter your name.");
});

test("validateEmail accepts ordinary addresses", () => {
  assert.equal(validateEmail("chadowdve674@gmail.com"), "");
  assert.equal(validateEmail("a.b+tag@sub.domain.org"), "");
  assert.equal(validateEmail("  padded@example.com  "), "");
});

test("validateEmail rejects malformed addresses", () => {
  const invalid = [
    "",
    "   ",
    "no-at-sign.example.com",
    "missing@tld",
    "@example.com",
    "user@.com",
    "two words@example.com",
  ];
  for (const value of invalid) {
    assert.notEqual(validateEmail(value), "", `expected ${JSON.stringify(value)} to be rejected`);
  }
});

test("validateEmail requires at least two characters in the TLD", () => {
  assert.equal(validateEmail("user@example.c"), "Please enter a valid email address (e.g. you@example.com).");
});

test("validateMessage enforces the empty and minimum-length rules", () => {
  assert.equal(validateMessage(""), "Please enter a message.");
  assert.equal(validateMessage("   "), "Please enter a message.");
  assert.equal(
    validateMessage("a".repeat(MIN_MESSAGE_LENGTH - 1)),
    `Message should be at least ${MIN_MESSAGE_LENGTH} characters.`
  );
  assert.equal(validateMessage("a".repeat(MIN_MESSAGE_LENGTH)), "");
});

test("validateMessage measures the trimmed message, not the raw input", () => {
  const padded = `   ${"a".repeat(MIN_MESSAGE_LENGTH)}   `;
  assert.equal(validateMessage(padded), "");
});

test("computeActiveSection keeps the first section active at the top", () => {
  const sections = [
    { id: "home", offsetTop: 0 },
    { id: "about", offsetTop: 900 },
    { id: "projects", offsetTop: 1800 },
  ];
  assert.equal(computeActiveSection(0, 1000, sections), "home");
});

test("computeActiveSection switches once the probe passes a section top", () => {
  const sections = [
    { id: "home", offsetTop: 0 },
    { id: "about", offsetTop: 900 },
  ];
  // probe = scrollY + 1000 * 0.35 = scrollY + 350
  assert.equal(computeActiveSection(500, 1000, sections), "home"); // probe 850 < 900
  assert.equal(computeActiveSection(550, 1000, sections), "about"); // probe 900 <= 900
  assert.equal(computeActiveSection(700, 1000, sections), "about");
});

test("computeActiveSection reports the last section near the page bottom", () => {
  const sections = [
    { id: "home", offsetTop: 0 },
    { id: "about", offsetTop: 900 },
    { id: "contact", offsetTop: 2600 },
  ];
  assert.equal(computeActiveSection(3000, 1000, sections), "contact");
});

test("computeActiveSection returns null without sections", () => {
  assert.equal(computeActiveSection(0, 1000, []), null);
  assert.equal(computeActiveSection(0, 1000, undefined), null);
});

test("the probe ratio matches the value the page was designed around", () => {
  assert.equal(SPY_PROBE_RATIO, 0.35);
});

test("FIELD_VALIDATORS maps each contact field to its validator", () => {
  assert.deepEqual(Object.keys(FIELD_VALIDATORS).sort(), ["email", "message", "name"]);
  assert.equal(FIELD_VALIDATORS.name, validateName);
  assert.equal(FIELD_VALIDATORS.email, validateEmail);
  assert.equal(FIELD_VALIDATORS.message, validateMessage);
});
