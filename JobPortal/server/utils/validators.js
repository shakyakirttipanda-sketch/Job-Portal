export const isValidEmail = (email) => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

export const isStrongPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return passwordRegex.test(password);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;

  return phoneRegex.test(phone);
};

export const isEmpty = (value) => {
  return !value || value.trim() === "";
};