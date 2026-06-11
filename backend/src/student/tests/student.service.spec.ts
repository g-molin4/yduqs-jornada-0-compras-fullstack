import { BadRequestException } from '@nestjs/common';
import { StudentMapper } from '../student.mapper';
import { StudentRepository } from '../student.repository';
import { StudentService } from '../student.service';
import { CreateStudentDTO } from '../student.dto';

describe('StudentService', () => {
  let service: StudentService;
  let repository: jest.Mocked<Pick<StudentRepository, 'enrollStudent' | 'validateStudantCourse'>>;
  let mapper: jest.Mocked<Pick<StudentMapper, 'toPrismaCreate' | 'toResponse'>>;

  const validPayload: CreateStudentDTO = {
    name: 'Gabriel Silva',
    email: 'gabriel@email.com',
    phone: '(19) 99999-9999',
    cpf: '529.982.247-25',
    birthDate: new Date('2000-05-20T00:00:00.000Z'),
    graduationYear: '2024',
    courseId: 'course-presencial-manha',
    priceId: 'course-price-18x',
  };

  beforeEach(() => {
    repository = {
      enrollStudent: jest.fn(),
      validateStudantCourse: jest.fn(),
    };

    mapper = {
      toPrismaCreate: jest.fn(),
      toResponse: jest.fn(),
    };

    service = new StudentService(
      repository as StudentRepository,
      mapper as StudentMapper,
    );
  });

  it('deve matricular um estudante valido', async () => {
    const prismaPayload = { name: 'Gabriel Silva' };
    const persistedStudent = { id: 'student-id' };
    const response = { id: 'student-id', name: 'Gabriel Silva' };

    repository.validateStudantCourse.mockResolvedValue(null);
    mapper.toPrismaCreate.mockReturnValue(prismaPayload as never);
    repository.enrollStudent.mockResolvedValue(persistedStudent as never);
    mapper.toResponse.mockReturnValue(response as never);

    await expect(service.enrollStudent(validPayload)).resolves.toEqual(response);

    expect(repository.validateStudantCourse).toHaveBeenCalledWith({
      email: 'gabriel@email.com',
      cpf: '529.982.247-25',
    });
    expect(mapper.toPrismaCreate).toHaveBeenCalledWith(validPayload);
    expect(repository.enrollStudent).toHaveBeenCalledWith(prismaPayload);
    expect(mapper.toResponse).toHaveBeenCalledWith(persistedStudent);
  });

  it.each([
    {
      label: 'invalid full name',
      data: { ...validPayload, name: 'Gabriel' },
      message: 'Informe o nome completo do aluno',
    },
    {
      label: 'invalid cpf',
      data: { ...validPayload, cpf: '111.111.111-11' },
      message: 'Informe um CPF valido',
    },
    {
      label: 'invalid birth date',
      data: { ...validPayload, birthDate: new Date('2999-01-01T00:00:00.000Z') },
      message: 'Informe uma data de nascimento valida',
    },
    {
      label: 'invalid phone',
      data: { ...validPayload, phone: '(10) 11111-1111' },
      message: 'Informe um telefone valido',
    },
  ])('deve lancar erro para $label', async ({ data, message }) => {
    await expect(service.enrollStudent(data)).rejects.toThrow(
      new BadRequestException(message),
    );

    expect(repository.validateStudantCourse).not.toHaveBeenCalled();
    expect(mapper.toPrismaCreate).not.toHaveBeenCalled();
  });

  it('deve rejeitar anos de conclusao maiores que o ano atual', async () => {
    const invalidYear = String(new Date().getFullYear() + 1);

    await expect(
      service.enrollStudent({
        ...validPayload,
        graduationYear: invalidYear,
      }),
    ).rejects.toThrow(
      new BadRequestException(
        `O ano de conclusao nao pode ser maior que ${new Date().getFullYear()}`,
      ),
    );

    expect(repository.validateStudantCourse).not.toHaveBeenCalled();
  });

  it('deve rejeitar estudantes duplicados', async () => {
    repository.validateStudantCourse.mockResolvedValue({ id: 'existing-id' } as never);

    await expect(service.enrollStudent(validPayload)).rejects.toThrow(
      new BadRequestException('Estudante ja cadastrado no curso'),
    );

    expect(mapper.toPrismaCreate).not.toHaveBeenCalled();
    expect(repository.enrollStudent).not.toHaveBeenCalled();
  });
});
