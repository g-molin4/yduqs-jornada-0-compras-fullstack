import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateStudentInput } from './student.types';
import { Student } from '@prisma/client';

@Injectable()
export class StudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async enrollStudent(data: CreateStudentInput) {
    return await this.prisma.student.create({
      data,
      include: {
        enrollments: {
          select: {
            courseId: true,
          },
        },
      },
    });
  }
  async validateStudantCourse(data: {
    email: string;
    courseId: string;
  }): Promise<Student | null> {
    return await this.prisma.student.findFirst({
      where: {
        email: data.email,
        enrollments: {
          some: {
            courseId: data.courseId,
          },
        },
      },
    });
  }
}
