import { validateEnrollment } from './enrollmentSchema'
import type { EnrollmentFormData } from '../types/enrollment'

describe('validateEnrollment', () => {
  const validData: EnrollmentFormData = {
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

  it('deve aceitar um payload de matricula valido', () => {
    expect(validateEnrollment(validData)).toEqual({
      isValid: true,
      errors: {},
    })
  })

  it('nao deve exigir parcela quando o curso selecionado nao tiver precos', () => {
    expect(
      validateEnrollment(
        {
          ...validData,
          priceId: '',
        },
        { requiresPriceSelection: false },
      ),
    ).toEqual({
      isValid: true,
      errors: {},
    })
  })

  it('deve exigir parcela quando o curso tiver opcoes de pagamento', () => {
    expect(
      validateEnrollment({
        ...validData,
        priceId: '',
      }),
    ).toEqual({
      isValid: false,
      errors: {
        priceId: 'Selecione uma parcela disponivel para continuar.',
      },
    })
  })

  it('deve retornar erros por campo para valores invalidos', () => {
    const result = validateEnrollment({
      courseId: '',
      priceId: '',
      birthDate: '31/02/2026',
      cpf: '111.111.111-11',
      graduationYear: String(new Date().getFullYear() + 1),
      phone: '(10) 11111-1111',
      studentName: 'Gabriel',
      studentEmail: '',
      acceptPrivacyPolicy: false,
      acceptWhatsappUpdates: false,
    })

    expect(result.isValid).toBe(false)
    expect(result.errors).toEqual({
      courseId: 'Selecione um curso.',
      priceId: 'Selecione uma parcela disponivel para continuar.',
      birthDate: 'Informe uma data de nascimento valida.',
      cpf: 'Informe um CPF valido.',
      graduationYear: `O ano de conclusao nao pode ser maior que ${new Date().getFullYear()}.`,
      phone: 'Informe um telefone valido.',
      studentName: 'Informe o nome completo do aluno.',
      studentEmail: 'Informe o e-mail do aluno.',
      acceptPrivacyPolicy: 'Aceite os termos para continuar.',
    })
  })
})
