// check if input is valid before sending it to BE 

export type ValidationResult = { valid: true } | { valid: false; message: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value: string, fieldName: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, message: `${fieldName} is required.` };
  }
  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) return { valid: false, message: 'Email is required.' };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, message: 'Please enter a valid email.' };
  return { valid: true };
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match.' };
  }
  return { valid: true };
}

export function validateEmailMatch(email: string, confirmEmail: string): ValidationResult {
  if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
    return { valid: false, message: 'Emails do not match.' };
  }
  return { valid: true };
}

export function validatePasswordLength(password: string, minLength = 8): ValidationResult {
  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters.` };
  }
  return { valid: true };
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.valid) return emailResult;
  const passResult = validateRequired(password, 'Password');
  if (!passResult.valid) return passResult;
  return { valid: true };
}

export function validateRegisterForm(params: {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirm: string;
  password: string;
  passwordConfirm: string;
  phone: string;
}): ValidationResult {
  const { firstName, lastName, email, emailConfirm, password, passwordConfirm, phone } = params;
  if (!firstName.trim()) return { valid: false, message: 'Not filled out. Please complete all fields.' };
  if (!lastName.trim()) return { valid: false, message: 'Not filled out. Please complete all fields.' };
  const emailResult = validateEmail(email);
  if (!emailResult.valid) return emailResult;
  const emailMatchResult = validateEmailMatch(email, emailConfirm);
  if (!emailMatchResult.valid) return emailMatchResult;
  const passRequired = validateRequired(password, 'Password');
  if (!passRequired.valid) return passRequired;
  const passLength = validatePasswordLength(password);
  if (!passLength.valid) return passLength;
  const passMatch = validatePasswordMatch(password, passwordConfirm);
  if (!passMatch.valid) return passMatch;
  if (!phone.trim()) return { valid: false, message: 'Not filled out. Please complete all fields.' };
  return { valid: true };
}

export function validateRecoverEmailForm(phone: string): ValidationResult {
  return validateRequired(phone, 'Phone number');
}

export function validateRecoverPasswordForm(phone: string, email: string): ValidationResult {
  const phoneResult = validateRequired(phone, 'Phone number');
  if (!phoneResult.valid) return phoneResult;
  return validateEmail(email);
}

export function validateSecurityAnswers(answers: string[]): ValidationResult {
  const allFilled = answers.every((a) => a.trim().length > 0);
  if (!allFilled) return { valid: false, message: 'Please answer all questions.' };
  return { valid: true };
}
