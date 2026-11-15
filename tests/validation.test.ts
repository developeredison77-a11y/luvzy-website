import { describe, expect, it } from 'vitest';
import { ageFromDateOfBirth, validateIndianMobile, withdrawalEligibility } from '../src/utils/validation';

describe('Indian mobile validation', () => {
  it('accepts a 10-digit number beginning from 6 to 9', () => expect(validateIndianMobile('9876543210')).toBeUndefined());
  it('rejects short numbers and unsupported prefixes', () => {
    expect(validateIndianMobile('123')).toContain('10 digits');
    expect(validateIndianMobile('1234567890')).toContain('start with');
  });
});

describe('date of birth validation', () => {
  it('calculates adult age at the birthday boundary', () => {
    expect(ageFromDateOfBirth('2008-06-11', new Date('2026-06-10T12:00:00'))).toBeUndefined();
    expect(ageFromDateOfBirth('2008-06-10', new Date('2026-06-10T12:00:00'))).toBe(18);
  });
  it('rejects impossible calendar dates', () => expect(ageFromDateOfBirth('2000-02-31')).toBeUndefined());
});

describe('sample withdrawal eligibility', () => {
  it('enforces adult, minimum balance, and one pending request', () => {
    expect(withdrawalEligibility(17, 800, false)).toContain('18 or older');
    expect(withdrawalEligibility(26, 499.75, false)).toContain('minimum');
    expect(withdrawalEligibility(26, 800, true)).toContain('pending');
    expect(withdrawalEligibility(26, 800, false)).toBeUndefined();
  });
});
