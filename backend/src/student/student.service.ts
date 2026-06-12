import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentDTO, StudentResponseDTO } from './student.dto';
import { StudentMapper } from './student.mapper';
import { StudentRepository } from './student.repository';
import { isValidCpf } from 'src/common/cpf.validation';
import {
  isValidBirthDate,
  isValidFullName,
  isValidPhone,
} from 'src/common/student.validation';
import { createLogger } from 'src/logger/logger';

@Injectable()
export class StudentService {
  private readonly logger = createLogger(StudentService.name);

  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly studentMapper: StudentMapper,
  ) {}

  async enrollStudent(data: CreateStudentDTO): Promise<StudentResponseDTO> {
    const currentYear = new Date().getFullYear();

    this.logger.info(
      {
        courseId: data.courseId,
        priceId: data.priceId ?? null,
      },
      'Student enrollment requested',
    );

    if (!isValidFullName(data.name)) {
      this.logger.warn(
        { reason: 'invalid_full_name' },
        'Enrollment validation failed',
      );
      throw new BadRequestException('Informe o nome completo do aluno');
    }

    if (!isValidCpf(data.cpf)) {
      this.logger.warn({ reason: 'invalid_cpf' }, 'Enrollment validation failed');
      throw new BadRequestException('Informe um CPF valido');
    }

    if (!isValidBirthDate(data.birthDate)) {
      this.logger.warn(
        { reason: 'invalid_birth_date' },
        'Enrollment validation failed',
      );
      throw new BadRequestException('Informe uma data de nascimento valida');
    }

    if (!isValidPhone(data.phone)) {
      this.logger.warn(
        { reason: 'invalid_phone' },
        'Enrollment validation failed',
      );
      throw new BadRequestException('Informe um telefone valido');
    }

    if (Number(data.graduationYear) > currentYear) {
      this.logger.warn(
        { reason: 'invalid_graduation_year', graduationYear: data.graduationYear },
        'Enrollment validation failed',
      );
      throw new BadRequestException(
        `O ano de conclusao nao pode ser maior que ${currentYear}`,
      );
    }

    const checkStudent = await this.studentRepository.validateStudantCourse({
      email: data.email,
      cpf: data.cpf,
    });

    if (checkStudent) {
      this.logger.warn(
        { courseId: data.courseId, reason: 'student_already_enrolled' },
        'Enrollment rejected',
      );
      throw new BadRequestException('Estudante ja cadastrado no curso');
    }

    const studentData = this.studentMapper.toPrismaCreate(data);
    const student = await this.studentRepository.enrollStudent(studentData);

    this.logger.info(
      {
        studentId: student.id,
        courseId: data.courseId,
      },
      'Student enrolled successfully',
    );

    return this.studentMapper.toResponse(student);
  }
}
