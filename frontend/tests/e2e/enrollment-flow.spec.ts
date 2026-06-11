import { expect, test } from '@playwright/test'

const coursesResponse = [
  {
    id: 'course-presencial-manha',
    name: 'Presencial - Manha',
    modality: 'PRESENCIAL',
    campus: 'CAMPINAS - VILA INDUSTRIAL',
    address: 'RUA DR. SALES DE OLIVEIRA, No 1661 - VILA INDUSTRIAL - CAMPINAS',
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
  },
  {
    id: 'course-ead',
    name: 'EAD',
    modality: 'EAD',
    campus: 'BARRA DA TIJUCA - TOM JOB',
    address: 'AV. DAS AMERICAS, 4200, BLOCO 11 - BARRA DA TIJUCA',
    prices: [],
  },
]

async function mockCourseApis(page: Parameters<typeof test>[0]['page']) {
  await page.route('**/api/course', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(coursesResponse),
    })
  })
}

async function goToEnrollmentForPricedCourse(page: Parameters<typeof test>[0]['page']) {
  await page.goto('/')

  await expect(page.getByText('2 opcoes encontradas')).toBeVisible()

  await page.getByTestId('course-card-advance-course-presencial-manha').click()

  await expect(page.getByTestId('course-details-sidebar')).toBeVisible()
  await expect(page.getByTestId('course-details-advance')).toBeDisabled()
  await expect(page.getByText('Selecione uma parcela para continuar.')).toBeVisible()

  await page.getByTestId('payment-option-course-price-18x').click()
  await expect(page.getByTestId('course-details-advance')).toBeEnabled()
  await page.getByTestId('course-details-advance').click()

  await expect(page.getByText('Queremos saber um pouco mais sobre voce')).toBeVisible()
  await expect(page).toHaveURL(/\/enrollment$/)
}

async function fillEnrollmentForm(page: Parameters<typeof test>[0]['page']) {
  await page.getByLabel('Nome completo').fill('Gabriel Silva')
  await page.getByLabel('CPF').fill('52998224725')
  await page.getByLabel('Data de nascimento').fill('20052000')
  await page.getByLabel('E-mail').fill('gabriel@email.com')
  await page.getByLabel('Celular para contato').fill('19999999999')
  await page.getByLabel('Ano de conclusao do ensino ...').fill('2024')
  await page.getByRole('checkbox').first().check()
}

test.describe('Fluxo de matricula', () => {
  test('deve concluir o fluxo de curso com preco', async ({ page }) => {
    await mockCourseApis(page)

    await page.route('**/api/student/enroll', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'student-id',
          name: 'Gabriel Silva',
          email: 'gabriel@email.com',
          phone: '(19) 99999-9999',
          cpf: '52998224725',
          birthDate: '2000-05-20T00:00:00.000Z',
          enrolments: [{ courseId: 'course-presencial-manha' }],
          createdAt: '2026-06-11T17:00:00.000Z',
        }),
      })
    })

    await goToEnrollmentForPricedCourse(page)
    await fillEnrollmentForm(page)

    await page.getByTestId('enrollment-submit').click()

    await expect(page).toHaveURL(/\/success$/)
    await expect(
      page.getByText('Gabriel Silva, sua matricula foi concluida com sucesso.'),
    ).toBeVisible()
  })

  test('deve permitir avancar sem selecionar parcela para cursos sem preco', async ({
    page,
  }) => {
    await mockCourseApis(page)

    await page.goto('/')

    await page.getByTestId('course-card-advance-course-ead').click()

    await expect(page.getByTestId('course-details-sidebar')).toBeVisible()
    await expect(page.getByText('Resumo das suas escolhas')).toBeVisible()
    await expect(page.getByTestId('course-details-advance')).toBeEnabled()

    await page.getByTestId('course-details-advance').click()

    await expect(page).toHaveURL(/\/enrollment$/)
    await expect(page.getByText('Queremos saber um pouco mais sobre voce')).toBeVisible()
  })

  test('deve exibir feedback inline e toast quando a matricula falhar', async ({ page }) => {
    await mockCourseApis(page)

    await page.route('**/api/student/enroll', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          statusCode: 400,
          message: 'Estudante ja cadastrado no curso',
          error: 'Bad Request',
        }),
      })
    })

    await goToEnrollmentForPricedCourse(page)
    await fillEnrollmentForm(page)

    await page.getByTestId('enrollment-submit').click()

    await expect(page).toHaveURL(/\/enrollment$/)
    await expect(page.locator('.status-message--error').first()).toHaveText(
      'Estudante ja cadastrado no curso',
    )
    await expect(
      page.getByRole('status').getByText('Estudante ja cadastrado no curso'),
    ).toBeVisible()
  })
})
