// utils/sanitizers.js

/**
 * Sanitizes user data by removing sensitive fields.
 * @param {Object} user - The user object to sanitize.
 * @returns {Object} The sanitized user object.
 */
export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...sanitizedUser } = user.dataValues;
  return sanitizedUser;
}
