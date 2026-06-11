import { getCourses } from './coursesService'
import type { CourseApiResponse } from '../types/course'

vi.mock('./api', () => ({
  apiRequest: vi.fn(),
}))

import { apiRequest } from './api'

describe('getCourses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve mapear cursos presenciais com preco para o formato do card', async () => {
    vi.mocked(apiRequest).mockResolvedValue([
      {
        id: 'course-presencial-manha',
        name: 'Presencial - Manha',
        modality: 'PRESENCIAL',
        campus: 'CAMPINAS - VILA INDUSTRIAL',
        address: 'RUA DR. SALES DE OLIVEIRA',
        prices: [
          {
            id: 'course-price-1x',
            name: '1x sem juros',
            totalPrice: '2613.60',
            installments: 1,
            discount: '2138.40',
            price: '2613.60',
          },
          {
            id: 'course-price-18x',
            name: '18x sem juros',
            totalPrice: '3059.10',
            installments: 18,
            discount: '1692.90',
            price: '169.95',
          },
        ],
      } satisfies CourseApiResponse,
    ])

    await expect(getCourses()).resolves.toEqual([
      expect.objectContaining({
        id: 'course-presencial-manha',
        title: 'Presencial',
        shift: 'Manha',
        oldPrice: 'De R$\u00a04.752,00 por ate',
        installmentsCount: '18x',
        currentPrice: 'R$\u00a0169,95',
        installment: 'a vista R$\u00a02.613,60',
        campus: 'CAMPINAS - VILA INDUSTRIAL',
        address: 'RUA DR. SALES DE OLIVEIRA',
        highlight: false,
        paymentOptions: [
          expect.objectContaining({
            id: 'course-price-1x',
            installmentsLabel: '1x R$\u00a02.613,60',
            totalLabel: 'R$\u00a02.613,60',
          }),
          expect.objectContaining({
            id: 'course-price-18x',
            installmentsLabel: '18x R$\u00a0169,95',
            totalLabel: 'R$\u00a03.059,10',
          }),
        ],
      }),
    ])

    expect(apiRequest).toHaveBeenCalledWith('/course')
  })

  it('deve mapear cursos sem preco como destaque', async () => {
    vi.mocked(apiRequest).mockResolvedValue([
      {
        id: 'course-ead',
        name: 'EAD',
        modality: 'EAD',
        campus: 'BARRA DA TIJUCA - TOM JOB',
        address: 'AV. DAS AMERICAS',
        prices: [],
      } satisfies CourseApiResponse,
    ])

    await expect(getCourses()).resolves.toEqual([
      expect.objectContaining({
        id: 'course-ead',
        title: 'Digital (EaD)',
        shift: '',
        oldPrice: '',
        installmentsCount: '',
        currentPrice: '',
        installment: '',
        highlight: true,
        paymentOptions: [],
      }),
    ])
  })
})
