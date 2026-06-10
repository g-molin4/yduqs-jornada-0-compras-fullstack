import { apiRequest } from './api'
import type { CourseOffer } from '../types/course'

const mockCourses: CourseOffer[] = [
  {
    id: 'presencial-manha',
    title: 'Presencial',
    shift: 'Manha',
    oldPrice: 'De R$ 4.752,00 por ate',
    installmentsCount: '18x',
    currentPrice: 'R$ 169,95',
    installment: 'a vista R$ 2.613,60',
    campus: 'CAMPINAS - VILA INDUSTRIAL',
    address: 'RUA DR. SALES DE OLIVEIRA, No 1661 - VILA INDUSTRIAL - CAMP...',
    highlight: false,
    paymentOptions: [
      { id: '1x', installmentsLabel: '1x R$ 2.613,6', totalLabel: 'R$ 2.613,60' },
      { id: '3x', installmentsLabel: '3x R$ 900,90', totalLabel: 'R$ 2.702,70' },
      { id: '6x', installmentsLabel: '6x R$ 465,30', totalLabel: 'R$ 2.791,80' },
      { id: '9x', installmentsLabel: '9x R$ 320,10', totalLabel: 'R$ 2.880,90' },
      { id: '12x', installmentsLabel: '12x R$ 247,5', totalLabel: 'R$ 2.946,00' },
      { id: '15x', installmentsLabel: '15x R$ 200,97', totalLabel: 'R$ 3.014,55' },
      { id: '18x', installmentsLabel: '18x R$ 169,95', totalLabel: 'R$ 3.059,10' },
    ],
  },
  {
    id: 'digital-ead',
    title: 'Digital (EaD)',
    shift: '',
    oldPrice: '',
    installmentsCount: '',
    currentPrice: '',
    installment: '',
    campus: 'BARRA DA TIJUCA - TOM JOB...',
    address: 'AV. DAS AMERICAS, 4.200, BLOCO 11 - BARRA DA TIJUCA...',
    highlight: true,
  },
]

export async function getCourses() {
  return apiRequest(async () => mockCourses)
}
