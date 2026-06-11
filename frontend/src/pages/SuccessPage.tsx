import { AppShell } from '../components/AppShell'
import { useEnrollment } from '../contexts/EnrollmentContext'

export function SuccessPage() {
  const { completedStudentName } = useEnrollment()

  return (
    <AppShell title="Matricula concluida" footerVariant="full" pageVariant="enrollment">
      <section className="success-section">
        <div className="container">
          <div className="success-card">
            <p className="success-card__eyebrow">Tudo certo</p>
            <h2>
              {completedStudentName
                ? `${completedStudentName}, sua matricula foi concluida com sucesso.`
                : 'Sua matricula foi concluida com sucesso.'}
            </h2>
            <p>
              Recebemos seus dados e em breve voce recebera as proximas orientacoes para continuar
              seu processo com a Estacio.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
