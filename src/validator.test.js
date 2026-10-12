import { describe, it, expect } from 'vitest';
import { validateIntakePayload } from './validator.js';

describe('Intake Validation Engine Labs', () => {
  it('should pass for a complete, valid intake record', () => {
    const validData = {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      birthDate: '1985-06-15',
      maritalStatus: 'Single'
    };
    const result = validateIntakePayload(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('FAILING TEST 1: should reject empty email strings', () => {
    const invalidData = {
      fullName: 'John Smith',
      email: '',
      birthDate: '1990-01-01',
      maritalStatus: 'Single'
    };
    const result = validateIntakePayload(invalidData);
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
    const result = validateIntakePayload(underageData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Applicant must be at least 18 years old.');
  });
});
