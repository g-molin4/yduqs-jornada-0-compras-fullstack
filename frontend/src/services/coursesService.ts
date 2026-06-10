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
