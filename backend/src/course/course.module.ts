import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseRepository } from './course.repository';
import { PrismaModule } from 'src/infra/prisma/prisma.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
  imports: [PrismaModule],
})
export class CourseModule {}
