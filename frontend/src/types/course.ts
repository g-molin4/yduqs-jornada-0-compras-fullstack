export type CoursePaymentOption = {
  id: string
  name: string
  installments: number
  price: string
  totalPrice: string
  discount: string
  installmentsLabel: string
  totalLabel: string
}

export type CourseModality = 'PRESENCIAL' | 'EAD'

export type CourseApiPrice = {
  id: string
  name: string
  totalPrice: string
  installments: number
  discount: string
  price: string
}

export type CourseApiResponse = {
  id: string
  name: string
  modality: CourseModality
  campus: string
  address: string
  prices: CourseApiPrice[]
}

export type CourseOffer = {
  id: string
  modality: CourseModality
  name: string
  title: string
  shift: string
  oldPrice: string
  installmentsCount: string
  currentPrice: string
  installment: string
  campus: string
  address: string
  highlight: boolean
  paymentOptions?: CoursePaymentOption[]
}
