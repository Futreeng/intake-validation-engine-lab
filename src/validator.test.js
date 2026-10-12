import { describe, it, expect } from 'vitest';
import { validateIntakePayload } from './validator.js';

// Fixed "today" so age tests are deterministic on every run and every machine.
const NOW = new Date('2026-10-12T12:00:00Z');

// Returns a YYYY-MM-DD birth date for someone who is `years` old on NOW,
// shifted by `offsetDays` (negative = older, positive = younger).
function birthDateYearsAgo(years, offsetDays = 0) {
  const d = new Date(NOW);
  d.setUTCFullYear(d.getUTCFullYear() - years);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const base = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  birthDate: '1985-06-15',
  maritalStatus: 'Single'
};

describe('Intake Validation Engine Labs', () => {
  // ----- Already working: these must keep passing -------------------------

  it('should pass for a complete, valid intake record', () => {
    const result = validateIntakePayload(base, { now: NOW });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should require a spouse name for married applicants', () => {
    const result = validateIntakePayload(
      { ...base, maritalStatus: 'Married' },
      { now: NOW }
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Spouse name is required for married applicants.');
  });

  it('should accept married applicants who provide a spouse name', () => {
    const result = validateIntakePayload(
      { ...base, maritalStatus: 'Married', spouseName: 'John Doe' },
      { now: NOW }
    );
    expect(result.isValid).toBe(true);
  });

  it('should require a birth date', () => {
    const { birthDate, ...withoutBirthDate } = base;
    const result = validateIntakePayload(withoutBirthDate, { now: NOW });
    expect(result.errors).toContain('Birth date is required.');
  });

  it('should require a full name', () => {
    const result = validateIntakePayload({ ...base, fullName: '   ' }, { now: NOW });
    expect(result.errors).toContain('Full name is required.');
  });

  // ----- Learner targets: these fail until the validator is fixed ---------

  it('FAILING TEST 1: should reject empty email strings', () => {
    const invalidData = {
      fullName: 'John Smith',
      email: '',
      birthDate: '1990-01-01',
      maritalStatus: 'Single'
    };
    const result = validateIntakePayload(invalidData, { now: NOW });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Valid email address is required.');
  });

  it('FAILING TEST 1b: should reject whitespace-only email strings', () => {
    const result = validateIntakePayload({ ...base, email: '   ' }, { now: NOW });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Valid email address is required.');
  });

  it('FAILING TEST 2: should reject applicants under 18 years old', () => {
    const underageData = {
      fullName: 'Minor Client',
      email: 'minor@example.com',
      birthDate: '2012-04-10',
      maritalStatus: 'Single'
    };
    const result = validateIntakePayload(underageData, { now: NOW });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Applicant must be at least 18 years old.');
  });

  it('BOUNDARY: should accept an applicant who turns 18 today (guards against off-by-one)', () => {
    const result = validateIntakePayload(
      { ...base, birthDate: birthDateYearsAgo(18) },
      { now: NOW }
    );
    expect(result.isValid).toBe(true);
  });

  it('FAILING TEST 2b: should reject an applicant who turns 18 tomorrow', () => {
    const result = validateIntakePayload(
      { ...base, birthDate: birthDateYearsAgo(18, 1) },
      { now: NOW }
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Applicant must be at least 18 years old.');
  });
});
