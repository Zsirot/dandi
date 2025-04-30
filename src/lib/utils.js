import { v4 as uuidv4 } from "uuid";

/**
 * Generates a new API key with the appropriate prefix based on the key type
 * @param {string} type - The type of key to generate ("production" or "development")
 * @returns {string} The generated API key
 */
export function generateApiKey(type = "development") {
  const prefix = type === "production" ? "dandi-prod-" : "dandi-dev-";
  const uuid = uuidv4().replace(/-/g, ""); // Remove hyphens from UUID
  return `${prefix}${uuid}`;
}
