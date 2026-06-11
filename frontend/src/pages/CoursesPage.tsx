import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { CourseCard } from '../components/CourseCard'
import { ErrorMessage } from '../components/ErrorMessage'
import { useToast } from '../components/ui/toast'
import { Loading } from '../components/Loading'
import { CourseDetailsPage } from './CourseDetailsPage'
import { useEnrollment } from '../contexts/EnrollmentContext'
import { getCourses } from '../services/coursesService'
import type { CourseOffer } from '../types/course'

export function CoursesPage() {
  const [courses, setCourses] = useState<CourseOffer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { closeDetails, isDetailsOpen, setSelectedCourse, setSelectedPriceId, openDetails } =
    useEnrollment()

  useEffect(() => {
    closeDetails()

    async function loadCourses() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getCourses()
        setCourses(response)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Nao foi possivel carregar os cursos agora.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadCourses()
  }, [closeDetails])

  useEffect(() => {
    if (error) {
      toast({ title: error })
    }
  }, [error, toast])

  return (
    <AppShell
      title="Vamos comecar, escolha as opcoes do seu curso"
      subtitle="Use os filtros para saber o preco do seu curso e fazer sua inscricao."
    >
      <section className="options-section">
        <div className="container">
          <p className="results-copy">{courses.length} opcoes encontradas</p>
          {isLoading ? <Loading /> : null}
          {error ? <ErrorMessage message={error} /> : null}
          {!isLoading && !error ? (
            <div className="options-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onAdvance={(selected) => {
                    setSelectedCourse(selected)
                    setSelectedPriceId(null)
                    openDetails()
                  }}
                />
              ))}
              </div>
            ) : null}
          </div>
        </section>
        {isDetailsOpen ? <CourseDetailsPage /> : null}
    </AppShell>
  )
}
