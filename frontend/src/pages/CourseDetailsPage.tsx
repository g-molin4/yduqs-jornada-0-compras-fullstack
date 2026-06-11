import { Info, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navigateTo } from '../app/routes'
import { Button } from '../components/ui/button'
import { useEnrollment } from '../contexts/EnrollmentContext'

export function CourseDetailsPage() {
  const { closeDetails, selectedCourse, setSelectedPriceId } = useEnrollment()
  const paymentOptions = selectedCourse?.paymentOptions ?? []
  const hasPaymentOptions = paymentOptions.length > 0
  const [selectedOptionId, setSelectedOptionId] = useState('')

  useEffect(() => {
    if (!selectedCourse) {
      closeDetails()
    }
  }, [closeDetails, selectedCourse])

  useEffect(() => {
    setSelectedOptionId('')
  }, [selectedCourse])

  useEffect(() => {
    setSelectedPriceId(null)
  }, [selectedCourse, setSelectedPriceId])

  if (!selectedCourse) {
    return null
  }

  return (
    <div className="details-panel-overlay" onClick={closeDetails}>
      <aside
        className="details-panel"
        onClick={(event) => event.stopPropagation()}
        aria-label="Mais detalhes"
      >
        <header className="details-panel__header">
          <h2>Mais detalhes</h2>
          <button
            type="button"
            className="details-panel__close"
            onClick={closeDetails}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </header>

        <div className="details-panel__body">
          {hasPaymentOptions ? (
            <>
              <p className="details-panel__prompt">Qual dessas opcoes de parcelas voce prefere?</p>

              <div className="details-table">
                <div className="details-table__head">
                  <span>Parcelas</span>
                  <span>Total</span>
                </div>

                <div className="details-table__body">
                  {paymentOptions.map((option) => {
                    const isSelected = option.id === selectedOptionId

                    return (
                      <label className="details-option" key={option.id}>
                        <span className={`details-option__radio${isSelected ? ' is-selected' : ''}`}>
                          <input
                            type="radio"
                            name="payment-option"
                            checked={isSelected}
                            onChange={() => setSelectedOptionId(option.id)}
                          />
                          <span />
                        </span>
                        <span className="details-option__installment">{option.installmentsLabel}</span>
                        <span className="details-option__total">{option.totalLabel}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <button type="button" className="details-accordion">
                <span>Sobre a Bolsa Incentivo</span>
                <Plus size={20} />
              </button>
            </>
          ) : (
            <>
              <div className="details-info-banner">
                <Info size={15} />
                <p>Inscreva-se para saber tudo sobre os valores e garantir a sua vaga!</p>
              </div>

              <div className="details-accordion-group">
                <button type="button" className="details-accordion">
                  <span>Sobre a Bolsa Incentivo</span>
                  <Plus size={20} />
                </button>

                <button type="button" className="details-accordion">
                  <span>Resumo das suas escolhas</span>
                  <Plus size={20} />
                </button>
              </div>
            </>
          )}
        </div>

        <footer className="details-panel__footer">
          {hasPaymentOptions && !selectedOptionId ? (
            <p className="details-panel__hint">Selecione uma parcela para continuar.</p>
          ) : null}
          <Button
            className="details-panel__button"
            disabled={hasPaymentOptions && !selectedOptionId}
            onClick={() => {
              setSelectedPriceId(hasPaymentOptions ? selectedOptionId : null)
              closeDetails()
              navigateTo('/enrollment')
            }}
          >
            {hasPaymentOptions ? 'Avancar' : 'Avanca'}
          </Button>
        </footer>
      </aside>
    </div>
  )
}
