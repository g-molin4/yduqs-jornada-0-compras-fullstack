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

@Injectable()
export class StudentService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly studentMapper: StudentMapper,
  ) {}

  async enrollStudent(data: CreateStudentDTO): Promise<StudentResponseDTO> {
    const currentYear = new Date().getFullYear();

    if (!isValidFullName(data.name)) {
      throw new BadRequestException('Informe o nome completo do aluno');
    }

    if (!isValidCpf(data.cpf)) {
      throw new BadRequestException('Informe um CPF valido');
    }

    if (!isValidBirthDate(data.birthDate)) {
      throw new BadRequestException('Informe uma data de nascimento valida');
    }

    if (!isValidPhone(data.phone)) {
      throw new BadRequestException('Informe um telefone valido');
    }

    if (Number(data.graduationYear) > currentYear) {
      throw new BadRequestException(
        `O ano de conclusao nao pode ser maior que ${currentYear}`,
      );
    }

    const checkStudent = await this.studentRepository.validateStudantCourse({
      email: data.email,
      cpf: data.cpf,
    });

    if (checkStudent) {
      throw new BadRequestException('Estudante ja cadastrado no curso');
    }

    const studentData = this.studentMapper.toPrismaCreate(data);
    const student = await this.studentRepository.enrollStudent(studentData);

    return this.studentMapper.toResponse(student);
  }
}
