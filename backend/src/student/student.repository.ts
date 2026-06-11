import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateStudentInput } from './student.types';
import { Student } from '@prisma/client';

@Injectable()
export class StudentRepository {
  constructor(private readonly prisma: PrismaService) { }

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
  async validateStudantCourse(data: { email: string, cpf: string }): Promise<Student | null> {
    return await this.prisma.student.findFirst({
      where: {
        OR: [
          { email: data.email },
          { cpf: data.cpf }
        ]
      },
    });
  }
}
