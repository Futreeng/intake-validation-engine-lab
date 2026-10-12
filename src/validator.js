/**
 * Validates incoming client intake records for estate planning applications.
 *
 * TASKS FOR LEARNER:
 * 1. Fix the bug where empty (or whitespace-only) email strings pass validation.
 * 2. Implement the age check: the primary client must be at least 18 years old.
 * 3. Verify that married applicants without a spouse name are flagged (already
 *    implemented; the tests protect it, so do not break it).
 *
 * `now` is injectable so age rules can be tested against a fixed date.
 */

const MINIMUM_AGE = 18;

export function validateIntakePayload(payload, { now = new Date() } = {}) {
  const errors = [];

  // Check required fields
  if (!payload.fullName || payload.fullName.trim() === '') {
    errors.push('Full name is required.');
  }

  // BUG 1: Only checks if the key exists, not if the string is empty or valid.
  if (!('email' in payload)) {
    errors.push('Valid email address is required.');
  }

  // BUG 2: Age calculation logic is missing completely.
  if (payload.birthDate) {
    // TODO: Add logic to ensure client is >= MINIMUM_AGE, measured on `now`.
  } else {
    errors.push('Birth date is required.');
  }

  // Married clients require spouse details (working; see task 3).
  if (payload.maritalStatus === 'Married' && !payload.spouseName) {
    errors.push('Spouse name is required for married applicants.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
