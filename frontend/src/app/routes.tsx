import { useLayoutEffect, useState } from 'react'
import { CoursesPage } from '../pages/CoursesPage'
import { EnrollmentPage } from '../pages/EnrollmentPage'
import { SuccessPage } from '../pages/SuccessPage'

const ROUTE_CHANGE_EVENT = 'app:route-change'

const routeMap = {
  '/': CoursesPage,
  '/enrollment': EnrollmentPage,
  '/success': SuccessPage,
} as const

export function navigateTo(pathname: keyof typeof routeMap) {
  window.history.pushState({}, '', pathname)
  window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT))
}

export function AppRoutes() {
  const [pathname, setPathname] = useState(window.location.pathname as keyof typeof routeMap)

  useLayoutEffect(() => {
    function handleRouteChange() {
      setPathname(window.location.pathname as keyof typeof routeMap)
    }

    handleRouteChange()
    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener(ROUTE_CHANGE_EVENT, handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener(ROUTE_CHANGE_EVENT, handleRouteChange)
    }
  }, [])

  const Page = routeMap[pathname] ?? CoursesPage

  return <Page />
}
