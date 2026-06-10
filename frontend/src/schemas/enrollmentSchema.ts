import type { EnrollmentFormData } from '../types/enrollment'

export function validateEnrollment(data: EnrollmentFormData) {
  const errors: Partial<Record<keyof EnrollmentFormData, string>> = {}

  if (!data.courseId.trim()) {
    errors.courseId = 'Selecione um curso.'
  }

  if (!data.birthDate.trim()) {
    errors.birthDate = 'Informe a data de nascimento.'
  }

  if (!data.cpf.trim()) {
    errors.cpf = 'Informe o CPF.'
  }

  if (!data.graduationYear.trim()) {
    errors.graduationYear = 'Informe o ano de conclusao.'
  }

  if (!data.phone.trim()) {
    errors.phone = 'Informe o celular.'
  }

  if (!data.studentName.trim()) {
    errors.studentName = 'Informe o nome do aluno.'
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
