import { apiRequest } from './api'
import type { EnrollmentFormData } from '../types/enrollment'

export async function submitEnrollment(payload: EnrollmentFormData) {
  return apiRequest(async () => ({
    success: true,
    payload,
  }))
}
