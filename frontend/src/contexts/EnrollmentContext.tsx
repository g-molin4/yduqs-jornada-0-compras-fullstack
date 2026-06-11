import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { CourseOffer } from '../types/course'

type EnrollmentContextValue = {
  isDetailsOpen: boolean
  openDetails: () => void
  closeDetails: () => void
  selectedCourse: CourseOffer | null
  setSelectedCourse: (course: CourseOffer | null) => void
  selectedPriceId: string | null
  setSelectedPriceId: (priceId: string | null) => void
  completedStudentName: string | null
  setCompletedStudentName: (studentName: string | null) => void
}

const EnrollmentContext = createContext<EnrollmentContextValue | undefined>(undefined)

export function EnrollmentProvider({ children }: PropsWithChildren) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseOffer | null>(null)
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null)
  const [completedStudentName, setCompletedStudentName] = useState<string | null>(null)
  const openDetails = useCallback(() => setIsDetailsOpen(true), [])
  const closeDetails = useCallback(() => setIsDetailsOpen(false), [])

  const value = useMemo(
    () => ({
      isDetailsOpen,
      openDetails,
      closeDetails,
      selectedCourse,
      setSelectedCourse,
      selectedPriceId,
      setSelectedPriceId,
      completedStudentName,
      setCompletedStudentName,
    }),
    [
      closeDetails,
      completedStudentName,
      isDetailsOpen,
      openDetails,
      selectedCourse,
      selectedPriceId,
    ],
  )

  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext)

  if (!context) {
    throw new Error('useEnrollment must be used within EnrollmentProvider')
  }

  return context
}
