import { Injectable } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { createLogger } from 'src/logger/logger';

@Injectable()
export class CourseService {
  private readonly logger = createLogger(CourseService.name);

  constructor(private readonly courseRepository: CourseRepository) {}

  async getCourses() {
    const courses = await this.courseRepository.getCourses();

    this.logger.info(
      { courseCount: courses.length },
      'Courses fetched successfully',
    );

    return courses;
  }
}
