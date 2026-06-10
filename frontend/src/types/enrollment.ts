export type EnrollmentFormData = {
  courseId: string
  studentName: string
  studentEmail: string
}

export type EnrollmentStatus = 'idle' | 'submitting' | 'success' | 'error'
