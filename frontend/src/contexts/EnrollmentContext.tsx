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
}

const EnrollmentContext = createContext<EnrollmentContextValue | undefined>(undefined)

export function EnrollmentProvider({ children }: PropsWithChildren) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseOffer | null>(null)
  const openDetails = useCallback(() => setIsDetailsOpen(true), [])
  const closeDetails = useCallback(() => setIsDetailsOpen(false), [])

  const value = useMemo(
    () => ({
      isDetailsOpen,
      openDetails,
      closeDetails,
      selectedCourse,
      setSelectedCourse,
    }),
    [closeDetails, isDetailsOpen, openDetails, selectedCourse],
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
