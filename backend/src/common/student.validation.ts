import { digitsOnly } from './cpf.validation';

export function isValidBirthDate(value: Date) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birthDate = new Date(value);
  birthDate.setHours(0, 0, 0, 0);

  return birthDate <= today;
}

export function isValidPhone(value: string) {
  const phone = digitsOnly(value);

  if (![10, 11].includes(phone.length) || /^(\d)\1+$/.test(phone)) {
    return false;
  }

  const ddd = Number(phone.slice(0, 2));

  return ddd >= 11 && ddd <= 99;
}

export function isValidFullName(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0).length >= 2;
}
