import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { CourseOffer } from '../types/course'

type EnrollmentContextValue = {
  selectedCourse: CourseOffer | null
  setSelectedCourse: (course: CourseOffer | null) => void
}

const EnrollmentContext = createContext<EnrollmentContextValue | undefined>(undefined)

export function EnrollmentProvider({ children }: PropsWithChildren) {
  const [selectedCourse, setSelectedCourse] = useState<CourseOffer | null>(null)

  const value = useMemo(
    () => ({
      selectedCourse,
      setSelectedCourse,
    }),
    [selectedCourse],
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
