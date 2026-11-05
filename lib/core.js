/* ============================================================
   Portfolio — pure logic shared by the page and the tests.
   No DOM access here: everything is a plain function of its
   arguments, so it runs the same in a browser and in Node.
   ============================================================ */

/** Share of the viewport height that decides which section is active. */
export const SPY_PROBE_RATIO = 0.35;

/** Minimum accepted length, in characters, for a contact message. */
export const MIN_MESSAGE_LENGTH = 20;

export const NAME_MESSAGES = {
  required: "Please enter your name.",
  short: "Name must be at least 2 characters.",
};
export const EMAIL_MESSAGES = {
  required: "Please enter your email address.",
  invalid: "Please enter a valid email address (e.g. you@example.com).",
};
export const MESSAGE_MESSAGES = {
  required: "Please enter a message.",
  short: `Message should be at least ${MIN_MESSAGE_LENGTH} characters.`,
};

/** @returns {""|"required"|"short"} */
export function checkName(value) {
  const name = String(value ?? "").trim();
  if (!name) return "required";
  if (name.length < 2) return "short";
  return "";
}

/** @returns {""|"required"|"invalid"} */
export function checkEmail(value) {
  const email = String(value ?? "").trim();
  if (!email) return "required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "invalid";
  return "";
}

/** @returns {""|"required"|"short"} */
export function checkMessage(value) {
  const message = String(value ?? "").trim();
  if (!message) return "required";
  if (message.length < MIN_MESSAGE_LENGTH) return "short";
  return "";
}

/**
 * @param {string} value
 * @returns {string} An error message, or an empty string when valid.
 */
export function validateName(value) {
  const code = checkName(value);
  return code ? NAME_MESSAGES[code] : "";
}

/**
 * @param {string} value
 * @returns {string} An error message, or an empty string when valid.
 */
export function validateEmail(value) {
  const code = checkEmail(value);
  return code ? EMAIL_MESSAGES[code] : "";
}

/**
 * @param {string} value
 * @returns {string} An error message, or an empty string when valid.
 */
export function validateMessage(value) {
  const code = checkMessage(value);
  return code ? MESSAGE_MESSAGES[code] : "";
}

/**
 * Resolve which section the reader is looking at.
 *
 * @param {number} scrollY Current vertical scroll offset.
 * @param {number} viewportHeight Current viewport height.
 * @param {Array<{ id: string, offsetTop: number }>} sections Ordered top to bottom.
 * @returns {string | null} The active section id, or null when there are none.
 */
export function computeActiveSection(scrollY, viewportHeight, sections) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  const probe = scrollY + viewportHeight * SPY_PROBE_RATIO;
  let active = sections[0].id;

  for (const section of sections) {
    if (section.offsetTop <= probe) active = section.id;
  }

  return active;
}

/**
 * Statically declared field rules, keyed by contact-form field name.
 * The page wires them to inputs; the tests exercise them directly.
 */
export const FIELD_VALIDATORS = {
  name: validateName,
  email: validateEmail,
  message: validateMessage,
};
