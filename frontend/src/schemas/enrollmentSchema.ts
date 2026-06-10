import type { EnrollmentFormData } from '../types/enrollment'

export function validateEnrollment(data: EnrollmentFormData) {
  const errors: Partial<Record<keyof EnrollmentFormData, string>> = {}

  if (!data.courseId.trim()) {
    errors.courseId = 'Selecione um curso.'
  }

  if (!data.studentName.trim()) {
    errors.studentName = 'Informe o nome do aluno.'
  }

  if (!data.studentEmail.trim()) {
    errors.studentEmail = 'Informe o e-mail do aluno.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
