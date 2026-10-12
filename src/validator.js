/**
 * Validates incoming client intake records for estate planning applications.
 * 
 * TASK FOR LEARNER:
 * 1. Fix the bug where empty email strings pass validation.
 * 2. Implement logic to verify that the primary client is at least 18 years old.
 * 3. Ensure marital status updates correctly flag required spouse fields.
 */

export function validateIntakePayload(payload) {
  const errors = [];

  // Check required fields
  if (!payload.fullName || payload.fullName.trim() === '') {
    errors.push('Full name is required.');
  }

  // BUG 1: Only checks if key exists, not if string is empty or valid email structure
  if (!('email' in payload)) {
    errors.push('Valid email address is required.');
  }

  // BUG 2: Age calculation logic is missing completely
  if (payload.birthDate) {
    // TODO: Add logic to ensure client is >= 18 years old
  } else {
    errors.push('Birth date is required.');
  }

  // BUG 3: Married clients require spouse details
  if (payload.maritalStatus === 'Married' && !payload.spouseName) {
    errors.push('Spouse name is required for married applicants.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
