export type EnrollmentFormData = {
  courseId: string
  birthDate: string
  cpf: string
  graduationYear: string
  phone: string
  studentName: string
  studentEmail: string
  acceptPrivacyPolicy: boolean
  acceptWhatsappUpdates: boolean
}

export type EnrollmentStatus = 'idle' | 'submitting' | 'success' | 'error'
