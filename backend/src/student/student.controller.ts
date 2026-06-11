import { Body, Controller, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDTO } from './student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/enroll')
  async enrollStudent(@Body() data: CreateStudentDTO) {
    return await this.studentService.enrollStudent(data);
  }
}
