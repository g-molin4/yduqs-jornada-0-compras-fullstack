import { EnrollmentProvider } from '../contexts/EnrollmentContext'
import { AppRoutes } from './routes'

function App() {
  return (
    <EnrollmentProvider>
      <AppRoutes />
    </EnrollmentProvider>
  )
}

export default App
