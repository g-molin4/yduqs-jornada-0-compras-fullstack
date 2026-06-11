import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EnrollmentProvider, useEnrollment } from './EnrollmentContext'
import type { CourseOffer } from '../types/course'

function TestConsumer() {
  const {
    isDetailsOpen,
    openDetails,
    closeDetails,
    selectedCourse,
    setSelectedCourse,
    selectedPriceId,
    setSelectedPriceId,
    completedStudentName,
    setCompletedStudentName,
  } = useEnrollment()

  const course: CourseOffer = {
    id: 'course-presencial-manha',
    modality: 'PRESENCIAL',
    name: 'Presencial - Manha',
    title: 'Presencial',
    shift: 'Manha',
    oldPrice: 'De R$ 4.752,00 por ate',
    installmentsCount: '18x',
    currentPrice: 'R$ 169,95',
    installment: 'a vista R$ 2.613,60',
    campus: 'CAMPINAS - VILA INDUSTRIAL',
    address: 'RUA DR. SALES DE OLIVEIRA',
    highlight: false,
    paymentOptions: [],
  }

  return (
    <div>
      <span data-testid="is-details-open">{String(isDetailsOpen)}</span>
      <span data-testid="selected-course">{selectedCourse?.id ?? 'none'}</span>
      <span data-testid="selected-price">{selectedPriceId ?? 'none'}</span>
      <span data-testid="completed-name">{completedStudentName ?? 'none'}</span>
      <button onClick={openDetails}>open</button>
      <button onClick={closeDetails}>close</button>
      <button onClick={() => setSelectedCourse(course)}>set-course</button>
      <button onClick={() => setSelectedPriceId('course-price-18x')}>set-price</button>
      <button onClick={() => setCompletedStudentName('Gabriel Silva')}>set-name</button>
    </div>
  )
}

describe('EnrollmentContext', () => {
  it('deve compartilhar o estado da matricula pela arvore', async () => {
    const user = userEvent.setup()

    render(
      <EnrollmentProvider>
        <TestConsumer />
      </EnrollmentProvider>,
    )

    expect(screen.getByTestId('is-details-open')).toHaveTextContent('false')
    expect(screen.getByTestId('selected-course')).toHaveTextContent('none')
    expect(screen.getByTestId('selected-price')).toHaveTextContent('none')
    expect(screen.getByTestId('completed-name')).toHaveTextContent('none')

    await user.click(screen.getByRole('button', { name: 'open' }))
    await user.click(screen.getByRole('button', { name: 'set-course' }))
    await user.click(screen.getByRole('button', { name: 'set-price' }))
    await user.click(screen.getByRole('button', { name: 'set-name' }))

    expect(screen.getByTestId('is-details-open')).toHaveTextContent('true')
    expect(screen.getByTestId('selected-course')).toHaveTextContent(
      'course-presencial-manha',
    )
    expect(screen.getByTestId('selected-price')).toHaveTextContent(
      'course-price-18x',
    )
    expect(screen.getByTestId('completed-name')).toHaveTextContent('Gabriel Silva')

    await user.click(screen.getByRole('button', { name: 'close' }))

    expect(screen.getByTestId('is-details-open')).toHaveTextContent('false')
  })

  it('deve lancar erro quando o hook for usado fora do provider', () => {
    expect(() => render(<TestConsumer />)).toThrow(
      'useEnrollment must be used within EnrollmentProvider',
    )
  })
})
