import type { EnrollmentFormData } from '../types/enrollment'

type ValidateEnrollmentOptions = {
  requiresPriceSelection?: boolean
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function isValidCpf(value: string) {
  const cpf = digitsOnly(value)

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  let sum = 0

  for (let index = 0; index < 9; index += 1) {
    sum += Number(cpf[index]) * (10 - index)
  }

  let remainder = (sum * 10) % 11

  if (remainder === 10) {
    remainder = 0
  }

  if (remainder !== Number(cpf[9])) {
    return false
  }

  sum = 0

  for (let index = 0; index < 10; index += 1) {
    sum += Number(cpf[index]) * (11 - index)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10) {
    remainder = 0
  }

  return remainder === Number(cpf[10])
}

function isValidBirthDate(value: string) {
  const [day, month, year] = value.split('/').map(Number)

  if (!day || !month || !year || value.length !== 10) {
    return false
  }

  const birthDate = new Date(year, month - 1, day)
  const today = new Date()

  const isSameDate =
    birthDate.getFullYear() === year &&
    birthDate.getMonth() === month - 1 &&
    birthDate.getDate() === day

  if (!isSameDate) {
    return false
  }

  today.setHours(0, 0, 0, 0)
  birthDate.setHours(0, 0, 0, 0)

  return birthDate <= today
}

function isValidPhone(value: string) {
  const phone = digitsOnly(value)

  if (![10, 11].includes(phone.length) || /^(\d)\1+$/.test(phone)) {
    return false
  }

  const ddd = Number(phone.slice(0, 2))

  return ddd >= 11 && ddd <= 99
}

function isValidFullName(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0).length >= 2
}

export function validateEnrollment(
  data: EnrollmentFormData,
  { requiresPriceSelection = true }: ValidateEnrollmentOptions = {},
) {
  const errors: Partial<Record<keyof EnrollmentFormData, string>> = {}
  const currentYear = new Date().getFullYear()

  if (!data.courseId.trim()) {
    errors.courseId = 'Selecione um curso.'
  }

  if (requiresPriceSelection && !data.priceId.trim()) {
    errors.priceId = 'Selecione uma parcela disponivel para continuar.'
  }

  if (!data.birthDate.trim()) {
    errors.birthDate = 'Informe a data de nascimento.'
  } else if (!isValidBirthDate(data.birthDate)) {
    errors.birthDate = 'Informe uma data de nascimento valida.'
  }

  if (!data.cpf.trim()) {
    errors.cpf = 'Informe o CPF.'
  } else if (!isValidCpf(data.cpf)) {
    errors.cpf = 'Informe um CPF valido.'
  }

  if (!data.graduationYear.trim()) {
    errors.graduationYear = 'Informe o ano de conclusao.'
  } else if (Number(data.graduationYear) > currentYear) {
    errors.graduationYear = `O ano de conclusao nao pode ser maior que ${currentYear}.`
  }

  if (!data.phone.trim()) {
    errors.phone = 'Informe o celular.'
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Informe um telefone valido.'
  }

  if (!data.studentName.trim()) {
    errors.studentName = 'Informe o nome do aluno.'
  } else if (!isValidFullName(data.studentName)) {
    errors.studentName = 'Informe o nome completo do aluno.'
  }

  if (!data.studentEmail.trim()) {
    errors.studentEmail = 'Informe o e-mail do aluno.'
  }

  if (!data.acceptPrivacyPolicy) {
    errors.acceptPrivacyPolicy = 'Aceite os termos para continuar.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
