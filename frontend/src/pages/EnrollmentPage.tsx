import { type FormEvent, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useEnrollment } from '../contexts/EnrollmentContext'
import { validateEnrollment } from '../schemas/enrollmentSchema'
import { submitEnrollment } from '../services/enrollmentService'
import type { EnrollmentFormData, EnrollmentStatus } from '../types/enrollment'

const initialFormData: EnrollmentFormData = {
  courseId: '',
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
  onChange: (value: string) => void
}

function EnrollmentInputField({
  label,
  type = 'text',
  value,
  inputMode,
  maxLength,
  onChange,
}: EnrollmentInputFieldProps) {
  return (
    <label className="enrollment-field">
      <Input
        type={type}
        value={value}
        placeholder=" "
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
      />
      <span className="enrollment-field__label">{label}</span>
    </label>
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
  const { selectedCourse } = useEnrollment()
  const [status, setStatus] = useState<EnrollmentStatus>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof EnrollmentFormData, string>>>({})
  const [formData, setFormData] = useState<EnrollmentFormData>({
    ...initialFormData,
    courseId: selectedCourse?.id ?? '',
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validateEnrollment(formData)
    setErrors(validation.errors)

    if (!validation.isValid) {
      return
    }

    setStatus('submitting')

    try {
      await submitEnrollment(formData)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <AppShell
      title="Queremos saber um pouco mais sobre voce"
      footerVariant="compact"
      pageVariant="enrollment"
    >
      <section className="enrollment-section enrollment-section--screen">
        <div className="container">
          <form className="enrollment-form" onSubmit={handleSubmit}>
            <div className="enrollment-fields">
              <EnrollmentInputField
                label="Nome completo"
                value={formData.studentName}
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
                onChange={(value) =>
                  setFormData((current) => ({ ...current, cpf: formatCpf(value) }))
                }
              />

              <EnrollmentInputField
                label="Data de nascimento"
                value={formData.birthDate}
                inputMode="numeric"
                maxLength={10}
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
                onChange={(value) =>
                  setFormData((current) => ({ ...current, studentEmail: value }))
                }
              />

              <EnrollmentInputField
                label="Celular para contato"
                value={formData.phone}
                inputMode="tel"
                maxLength={15}
                onChange={(value) =>
                  setFormData((current) => ({ ...current, phone: formatPhone(value) }))
                }
              />

              <EnrollmentInputField
                label="Ano de conclusao do ensino ..."
                value={formData.graduationYear}
                inputMode="numeric"
                maxLength={4}
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

            {Object.keys(errors).length > 0 ? (
              <p className="status-message status-message--error">
                Revise os campos obrigatorios para continuar.
              </p>
            ) : null}

            {status === 'success' ? (
              <p className="status-message">Dados enviados com sucesso.</p>
            ) : null}

            <div className="enrollment-actions">
              <Button className="enrollment-button" type="submit" disabled={status === 'submitting'}>
                Avancar
              </Button>
            </div>
          </form>
        </div>
      </section>
    </AppShell>
  )
}
