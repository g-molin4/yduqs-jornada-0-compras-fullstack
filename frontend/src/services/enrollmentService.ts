import { apiRequest } from './api'
import type {
  EnrollmentFormData,
  EnrollmentRequestPayload,
  EnrollmentResponse,
} from '../types/enrollment'

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function formatBirthDateToIso(value: string) {
  const [day, month, year] = value.split('/')

  if (!day || !month || !year) {
    throw new Error('Informe uma data de nascimento valida.')
  }

  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).toISOString()
}

function mapEnrollmentPayload(formData: EnrollmentFormData): EnrollmentRequestPayload {
  const payload: EnrollmentRequestPayload = {
    name: formData.studentName.trim(),
    email: formData.studentEmail.trim(),
    phone: formData.phone.trim(),
    cpf: digitsOnly(formData.cpf),
    birthDate: formatBirthDateToIso(formData.birthDate),
    graduationYear: formData.graduationYear.trim(),
    courseId: formData.courseId,
  }

  if (formData.priceId.trim()) {
    payload.priceId = formData.priceId
  }

  return payload
}

export async function submitEnrollment(formData: EnrollmentFormData) {
  const payload = mapEnrollmentPayload(formData)

  return apiRequest<EnrollmentResponse>('/student/enroll', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
