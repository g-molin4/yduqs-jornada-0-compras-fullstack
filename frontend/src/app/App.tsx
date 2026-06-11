import { EnrollmentProvider } from '../contexts/EnrollmentContext'
import { ToastProvider } from '../components/ui/toast'
import { AppRoutes } from './routes'

function App() {
  return (
    <ToastProvider>
      <EnrollmentProvider>
        <AppRoutes />
      </EnrollmentProvider>
    </ToastProvider>
  )
}

export default App
