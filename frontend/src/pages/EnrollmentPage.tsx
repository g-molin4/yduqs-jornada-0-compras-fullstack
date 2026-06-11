import { type FormEvent, useEffect, useState } from 'react'
import { navigateTo } from '../app/routes'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useToast } from '../components/ui/toast'
import { useEnrollment } from '../contexts/EnrollmentContext'
import { validateEnrollment } from '../schemas/enrollmentSchema'
import { submitEnrollment } from '../services/enrollmentService'
import type { EnrollmentFormData, EnrollmentStatus } from '../types/enrollment'

const initialFormData: EnrollmentFormData = {
  courseId: '',
  priceId: '',
  birthDate: '',
  cpf: '',
  graduationYear: '',
  phone: '',
  studentName: '',
  studentEmail: '',
  acceptPrivacyPolicy: false,
  acceptWhatsappUpdates: false,
}

type EnrollmentInputFieldProps = {
  label: string
  type?: string
  value: string
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
  error?: string
  onChange: (value: string) => void
}

function EnrollmentInputField({
  label,
  type = 'text',
  value,
  inputMode,
  maxLength,
  error,
  onChange,
}: EnrollmentInputFieldProps) {
  return (
    <div className="enrollment-field-group">
      <label className="enrollment-field">
        <Input
          type={type}
          value={value}
          placeholder=" "
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
          aria-invalid={error ? 'true' : 'false'}
        />
        <span className="enrollment-field__label">{label}</span>
      </label>
      {error ? <p className="enrollment-field__error">{error}</p> : null}
    </div>
  )
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function formatCpf(value: string) {
  const digits = digitsOnly(value).slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatBirthDate(value: string) {
  const digits = digitsOnly(value).slice(0, 8)

  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function formatPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 11)

  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatGraduationYear(value: string) {
  return digitsOnly(value).slice(0, 4)
}

export function EnrollmentPage() {
  const { selectedCourse, selectedPriceId, setCompletedStudentName } = useEnrollment()
  const { toast } = useToast()
  const [status, setStatus] = useState<EnrollmentStatus>('idle')
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof EnrollmentFormData, string>>>({})
  const requiresPriceSelection = (selectedCourse?.paymentOptions?.length ?? 0) > 0
  const hasRequiredJourneyState =
    Boolean(selectedCourse) && (!requiresPriceSelection || Boolean(selectedPriceId?.trim()))
  const [formData, setFormData] = useState<EnrollmentFormData>({
    ...initialFormData,
    courseId: selectedCourse?.id ?? '',
    priceId: selectedPriceId ?? '',
  })

  useEffect(() => {
    if (!hasRequiredJourneyState) {
      navigateTo('/')
    }
  }, [hasRequiredJourneyState])

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      courseId: selectedCourse?.id ?? '',
      priceId: selectedPriceId ?? '',
    }))
  }, [selectedCourse, selectedPriceId])

  useEffect(() => {
    if (status === 'error' && submissionMessage) {
      toast({ title: submissionMessage })
    }
  }, [status, submissionMessage, toast])

  const isFormReadyToSubmit =
    formData.courseId.trim().length > 0 &&
    (!requiresPriceSelection || formData.priceId.trim().length > 0) &&
    formData.studentName.trim().length > 0 &&
    formData.cpf.trim().length > 0 &&
    formData.birthDate.trim().length > 0 &&
    formData.studentEmail.trim().length > 0 &&
    formData.phone.trim().length > 0 &&
    formData.graduationYear.trim().length > 0 &&
    formData.acceptPrivacyPolicy
  const formLevelError = errors.priceId ?? errors.acceptPrivacyPolicy ?? null

  if (!hasRequiredJourneyState) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmissionMessage(null)

    const validation = validateEnrollment(formData, { requiresPriceSelection })
    setErrors(validation.errors)

    if (!validation.isValid) {
      return
    }

    setStatus('submitting')

    try {
      const response = await submitEnrollment(formData)
      setCompletedStudentName(response.name)
      setStatus('success')
      navigateTo('/success')
    } catch (error) {
      setStatus('error')
      setSubmissionMessage(
        error instanceof Error ? error.message : 'Nao foi possivel concluir a matricula.',
      )
    }
  }

  return (
    <AppShell
      title="Queremos saber um pouco mais sobre voce"
      footerVariant="full"
      pageVariant="enrollment"
    >
      <section className="enrollment-section enrollment-section--screen">
        <div className="container">
          <form className="enrollment-form" onSubmit={handleSubmit}>
            <div className="enrollment-fields">
              <EnrollmentInputField
                label="Nome completo"
                value={formData.studentName}
                error={errors.studentName}
                onChange={(value) =>
                  setFormData((current) => ({ ...current, studentName: value }))
                }
              />
              <p className="enrollment-help">
                Preencha seu nome completo, sem abreviacoes, igual ao seu documento de
                identificacao. <a href="/">Confira o exemplo.</a>
              </p>

              <EnrollmentInputField
                label="CPF"
                value={formData.cpf}
                inputMode="numeric"
                maxLength={14}
                error={errors.cpf}
                onChange={(value) =>
                  setFormData((current) => ({ ...current, cpf: formatCpf(value) }))
                }
              />

              <EnrollmentInputField
                label="Data de nascimento"
                value={formData.birthDate}
                inputMode="numeric"
                maxLength={10}
                error={errors.birthDate}
                onChange={(value) =>
                  setFormData((current) => ({
                    ...current,
                    birthDate: formatBirthDate(value),
                  }))
                }
              />

              <EnrollmentInputField
                label="E-mail"
                type="email"
                value={formData.studentEmail}
                error={errors.studentEmail}
                onChange={(value) =>
                  setFormData((current) => ({ ...current, studentEmail: value }))
                }
              />

              <EnrollmentInputField
                label="Celular para contato"
                value={formData.phone}
                inputMode="tel"
                maxLength={15}
                error={errors.phone}
                onChange={(value) =>
                  setFormData((current) => ({ ...current, phone: formatPhone(value) }))
                }
              />

              <EnrollmentInputField
                label="Ano de conclusao do ensino ..."
                value={formData.graduationYear}
                inputMode="numeric"
                maxLength={4}
                error={errors.graduationYear}
                onChange={(value) =>
                  setFormData((current) => ({
                    ...current,
                    graduationYear: formatGraduationYear(value),
                  }))
                }
              />
            </div>

            <div className="enrollment-consents">
              <label className="enrollment-checkbox">
                <input
                  type="checkbox"
                  checked={formData.acceptPrivacyPolicy}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      acceptPrivacyPolicy: event.target.checked,
                    }))
                  }
                />
                <span>
                  Li e concordo com os <a href="/">termos do edital</a>, bem como com o
                  tratamento dos meus dados para fins de prospeccao dos servicos educacionais
                  prestados pela Estacio e demais instituicoes de ensino do mesmo{' '}
                  <a href="/">Grupo Economico</a>, de acordo com a nossa{' '}
                  <a href="/">politica de privacidade</a>.
                </span>
              </label>

              <label className="enrollment-checkbox">
                <input
                  type="checkbox"
                  checked={formData.acceptWhatsappUpdates}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      acceptWhatsappUpdates: event.target.checked,
                    }))
                  }
                />
                <span>Aceito receber atualizacoes sobre minha inscricao pelo WhatsApp.</span>
              </label>
            </div>

            {formLevelError ? (
              <p className="status-message status-message--error">{formLevelError}</p>
            ) : null}

            {status === 'error' && submissionMessage ? (
              <p className="status-message status-message--error">{submissionMessage}</p>
            ) : null}

            <div className="enrollment-actions">
              <Button
                className="enrollment-button"
                data-testid="enrollment-submit"
                type="submit"
                disabled={status === 'submitting' || !isFormReadyToSubmit}
              >
                Avancar
              </Button>
            </div>
          </form>
        </div>
      </section>
    </AppShell>
  )
}
