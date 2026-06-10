import { CoursesPage } from '../pages/CoursesPage'
import { CourseDetailsPage } from '../pages/CourseDetailsPage'
import { EnrollmentPage } from '../pages/EnrollmentPage'
import { SuccessPage } from '../pages/SuccessPage'

const routeMap = {
  '/': CoursesPage,
  '/course-details': CourseDetailsPage,
  '/enrollment': EnrollmentPage,
  '/success': SuccessPage,
} as const

export function AppRoutes() {
  const pathname = window.location.pathname as keyof typeof routeMap
  const Page = routeMap[pathname] ?? CoursesPage

  return <Page />
}
