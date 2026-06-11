import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StudentRepository } from './student.repository';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { StudentMapper } from './student.mapper';

@Module({
  imports: [PrismaModule],
  providers: [StudentService, StudentRepository, StudentMapper],
  controllers: [StudentController],
})
export class StudentModule {}
