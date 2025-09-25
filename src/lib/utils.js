export function normalize(s = "") {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Converts Airtable "Priority" field into an access level.
 * @param {string|null} priority - The Priority field from Airtable ("Definitely" | "Maybe" | null)
 * @returns {"full" | "limited"}
 */
export function getAccessLevel(priority) {
  return String(priority || "").toLowerCase() === "definitely"
    ? "full"
    : "limited"
}
