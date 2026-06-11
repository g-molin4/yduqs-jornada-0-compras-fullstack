import { apiRequest } from './api'
import type { CourseApiResponse, CourseOffer, CoursePaymentOption } from '../types/course'

function formatCurrency(value: string) {
  const amount = Number(value)

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isFinite(amount) ? amount : 0)
}

function mapPaymentOption(price: CourseApiResponse['prices'][number]): CoursePaymentOption {
  return {
    id: price.id,
    name: price.name,
    installments: price.installments,
    price: price.price,
    totalPrice: price.totalPrice,
    discount: price.discount,
    installmentsLabel: `${price.installments}x ${formatCurrency(price.price)}`,
    totalLabel: formatCurrency(price.totalPrice),
  }
}

function splitCourseName(course: CourseApiResponse) {
  if (course.modality === 'EAD') {
    return {
      title: 'Digital (EaD)',
      shift: '',
    }
  }

  const [title, shift = ''] = course.name.split(' - ')

  return {
    title: title || course.name,
    shift,
  }
}

function mapCourse(course: CourseApiResponse): CourseOffer {
  const paymentOptions = course.prices.map(mapPaymentOption)
  const hasPaymentOptions = paymentOptions.length > 0
  const featuredOption = hasPaymentOptions ? paymentOptions.at(-1)! : null
  const oneTimeOption =
    paymentOptions.find((option) => option.installments === 1) ?? paymentOptions.at(0) ?? null
  const oldPriceValue =
    featuredOption && Number.isFinite(Number(featuredOption.totalPrice)) && Number.isFinite(Number(featuredOption.discount))
      ? formatCurrency(String(Number(featuredOption.totalPrice) + Number(featuredOption.discount)))
      : ''
  const { title, shift } = splitCourseName(course)

  return {
    id: course.id,
    modality: course.modality,
    name: course.name,
    title,
    shift,
    oldPrice: oldPriceValue ? `De ${oldPriceValue} por ate` : '',
    installmentsCount: featuredOption ? `${featuredOption.installments}x` : '',
    currentPrice: featuredOption ? formatCurrency(featuredOption.price) : '',
    installment: oneTimeOption ? `a vista ${formatCurrency(oneTimeOption.totalPrice)}` : '',
    campus: course.campus,
    address: course.address,
    highlight: !hasPaymentOptions,
    paymentOptions,
  }
}

export async function getCourses() {
  const response = await apiRequest<CourseApiResponse[]>('/course')

  return response.map(mapCourse)
}
