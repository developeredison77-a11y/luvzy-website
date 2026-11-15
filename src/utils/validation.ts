export function validateIndianMobile(value: string): string | undefined {
  if (!value) return 'Please enter your mobile number.';
  if (!/^\d{10}$/.test(value)) return 'Enter exactly 10 digits for your mobile number.';
  if (!/^[6-9]/.test(value)) return 'Mobile number should start with 6, 7, 8 or 9.';
  return undefined;
}

export function ageFromDateOfBirth(value: string, now = new Date()): number | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const birth = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (birth.getFullYear() !== Number(match[1]) || birth.getMonth() !== Number(match[2]) - 1 || birth.getDate() !== Number(match[3]) || birth > now) return undefined;
  const years = now.getFullYear() - birth.getFullYear() - (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate()) ? 1 : 0);
  return years >= 18 && years <= 110 ? years : undefined;
}

export function withdrawalEligibility(age: number, available: number, hasPending: boolean): string | undefined {
  if (age < 18) return 'You must be 18 or older to request a withdrawal.';
  if (available < 500) return 'The minimum demo withdrawal is ₹500.';
  if (hasPending) return 'You already have a request pending review.';
  return undefined;
}
