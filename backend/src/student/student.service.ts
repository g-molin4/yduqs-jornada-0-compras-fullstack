import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentDTO, StudentResponseDTO } from './student.dto';
import { StudentMapper } from './student.mapper';
import { StudentRepository } from './student.repository';

@Injectable()
export class StudentService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly studentMapper: StudentMapper,
  ) {}

  async enrollStudent(data: CreateStudentDTO): Promise<StudentResponseDTO> {
    //verifica se o estudando já não está cadastrado no curso

    const checkStudent = await this.studentRepository.validateStudantCourse({
      email: data.email,
      courseId: data.courseId,
    });

    if (checkStudent) {
      throw new BadRequestException('Estudante já cadastrado no curso');
    }

    const studentData = this.studentMapper.toPrismaCreate(data);
    const student = await this.studentRepository.enrollStudent(studentData);

    return this.studentMapper.toResponse(student);
  }
}
