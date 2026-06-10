export type CoursePaymentOption = {
  id: string
  installmentsLabel: string
  totalLabel: string
}

export type CourseOffer = {
  id: string
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
