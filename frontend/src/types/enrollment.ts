export type EnrollmentFormData = {
  courseId: string
  priceId: string
  birthDate: string
  cpf: string
  graduationYear: string
  phone: string
  studentName: string
  studentEmail: string
  acceptPrivacyPolicy: boolean
  acceptWhatsappUpdates: boolean
}

export type EnrollmentRequestPayload = {
  name: string
  email: string
  phone: string
  cpf: string
  birthDate: string
  graduationYear: string
  courseId: string
  priceId?: string
}

export type EnrollmentResponse = {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  birthDate: string
  enrolments: Array<{
    courseId: string
  }>
  createdAt: string
}

export type EnrollmentStatus = 'idle' | 'submitting' | 'success' | 'error'
