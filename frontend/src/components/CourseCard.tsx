import { Info } from 'lucide-react'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import type { CourseOffer } from '../types/course'

type CourseCardProps = {
  course: CourseOffer
  onAdvance?: (course: CourseOffer) => void
}

export function CourseCard({ course, onAdvance }: CourseCardProps) {
  return (
    <Card className="course-card">
      <CardHeader className="course-card__header">
        <div className="course-card__tabs">
          <CardTitle>{course.title}</CardTitle>
          {course.shift ? <span>{course.shift}</span> : null}
        </div>
        {course.highlight ? (
          <CardDescription className="course-card__description">
            <Info size={14} />
            <span>Inscreva-se para saber tudo sobre os valores e garantir a sua vaga!</span>
          </CardDescription>
        ) : (
          <div className="course-card__price">
            <p className="course-card__old-price">{course.oldPrice}</p>
            <div className="course-card__price-row">
              <span className="course-card__installments-count">{course.installmentsCount}</span>
              <p className="course-card__current-price">{course.currentPrice}</p>
            </div>
            <p className="course-card__installment">{course.installment}</p>
          </div>
        )}
        <Button className="course-card__button" onClick={() => onAdvance?.(course)}>
          Avancar
        </Button>
      </CardHeader>
      <CardContent className="course-card__body">
        <p className="course-card__campus">{course.campus}</p>
        <p className="course-card__address">{course.address}</p>
      </CardContent>
    </Card>
  )
}
