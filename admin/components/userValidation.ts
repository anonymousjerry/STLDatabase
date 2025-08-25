export interface UserValidationErrors {
  username?: string;
  email?: string;
  role?: string;
}

export interface UserFormData {
  username?: string;
  email?: string;
  role?: "user" | "admin";
}

export const validateUser = (data: UserFormData): UserValidationErrors => {
  const errors: UserValidationErrors = {};

  // Username validation
  if (!data.username || data.username.trim() === '') {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  } else if (data.username.length > 50) {
    errors.username = 'Username must be less than 50 characters';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    errors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
  }

  // Email validation
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (data.email.length > 100) {
      errors.email = 'Email must be less than 100 characters';
    }
  }

  // Role validation
  if (!data.role) {
    errors.role = 'Role is required';
  } else if (!['user', 'admin'].includes(data.role)) {
    errors.role = 'Role must be either user or admin';
  }

  return errors;
};

export const hasValidationErrors = (errors: UserValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const getFieldError = (errors: UserValidationErrors, field: keyof UserValidationErrors): string | undefined => {
  return errors[field];
};

export const isFieldValid = (errors: UserValidationErrors, field: keyof UserValidationErrors): boolean => {
  return !errors[field];
};
