// src/modules/students/mappers/student.mapper.ts
import { Injectable } from '@nestjs/common';
import { CreateStudentDTO } from './student.dto';
import { StudentResponseDTO } from './student.dto';
import { CreateStudentInput, StudentWithCourse } from './student.types';

@Injectable()
export class StudentMapper {
  toPrismaCreate(dto: CreateStudentDTO): CreateStudentInput {
    return {
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone.trim(),
      cpf: dto.cpf.trim(),
      birthDate: dto.birthDate,
      graduationYear: dto.graduationYear.trim(),

      enrollments: {
        create: {
          courseId: dto.courseId,
          priceId: dto.priceId,
        },
      },
    };
  }

  toResponse(student: StudentWithCourse): StudentResponseDTO {
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      cpf: student.cpf,
      birthDate: student.birthDate,
      enrolments: student.enrollments,
      createdAt: student.createdAt,
    };
  }
}
