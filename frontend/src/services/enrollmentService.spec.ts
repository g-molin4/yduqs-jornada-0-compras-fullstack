import { submitEnrollment } from './enrollmentService'
import type { EnrollmentFormData } from '../types/enrollment'

vi.mock('./api', () => ({
  apiRequest: vi.fn(),
}))

import { apiRequest } from './api'

describe('submitEnrollment', () => {
  const formData: EnrollmentFormData = {
    courseId: 'course-presencial-manha',
    priceId: 'course-price-18x',
    birthDate: '20/05/2000',
    cpf: '529.982.247-25',
    graduationYear: '2024',
    phone: '(19) 99999-9999',
    studentName: 'Gabriel Silva',
    studentEmail: 'gabriel@email.com',
    acceptPrivacyPolicy: true,
    acceptWhatsappUpdates: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve enviar um payload de matricula normalizado', async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      id: 'student-id',
      name: 'Gabriel Silva',
    })

    await submitEnrollment(formData)

    expect(apiRequest).toHaveBeenCalledWith('/student/enroll', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Gabriel Silva',
        email: 'gabriel@email.com',
        phone: '(19) 99999-9999',
        cpf: '52998224725',
        birthDate: '2000-05-20T00:00:00.000Z',
        graduationYear: '2024',
        courseId: 'course-presencial-manha',
        priceId: 'course-price-18x',
      }),
    })
  })

  it('deve omitir priceId quando estiver em branco', async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      id: 'student-id',
      name: 'Gabriel Silva',
    })

    await submitEnrollment({
      ...formData,
      priceId: '   ',
    })

    expect(apiRequest).toHaveBeenCalledWith('/student/enroll', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Gabriel Silva',
        email: 'gabriel@email.com',
        phone: '(19) 99999-9999',
        cpf: '52998224725',
        birthDate: '2000-05-20T00:00:00.000Z',
        graduationYear: '2024',
        courseId: 'course-presencial-manha',
      }),
    })
  })

  it('deve lancar erro quando o formato da data de nascimento estiver incompleto', async () => {
    await expect(
      submitEnrollment({
        ...formData,
        birthDate: '20/05',
      }),
    ).rejects.toThrow('Informe uma data de nascimento valida.')
  })
})
