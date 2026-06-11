import { StudentMapper } from '../student.mapper';
import { CreateStudentDTO } from '../student.dto';

describe('StudentMapper', () => {
  let mapper: StudentMapper;

  beforeEach(() => {
    mapper = new StudentMapper();
  });

  it('deve mapear o payload do estudante para o prisma incluindo priceId', () => {
    const dto: CreateStudentDTO = {
      name: '  Gabriel Silva  ',
      email: '  GABRIEL@EMAIL.COM  ',
      phone: ' (19) 99999-9999 ',
      cpf: ' 123.456.789-09 ',
      birthDate: new Date('2000-05-20T00:00:00.000Z'),
      graduationYear: ' 2024 ',
      courseId: 'course-presencial-manha',
      priceId: 'course-price-18x',
    };

    expect(mapper.toPrismaCreate(dto)).toEqual({
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      phone: '(19) 99999-9999',
      cpf: '123.456.789-09',
      birthDate: new Date('2000-05-20T00:00:00.000Z'),
      graduationYear: '2024',
      enrollments: {
        create: {
          courseId: 'course-presencial-manha',
          priceId: 'course-price-18x',
        },
      },
    });
  });

  it('deve omitir priceId quando estiver em branco', () => {
    const dto: CreateStudentDTO = {
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      phone: '(19) 99999-9999',
      cpf: '123.456.789-09',
      birthDate: new Date('2000-05-20T00:00:00.000Z'),
      graduationYear: '2024',
      courseId: 'course-ead',
      priceId: '   ',
    };

    expect(mapper.toPrismaCreate(dto)).toEqual({
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      phone: '(19) 99999-9999',
      cpf: '123.456.789-09',
      birthDate: new Date('2000-05-20T00:00:00.000Z'),
      graduationYear: '2024',
      enrollments: {
        create: {
          courseId: 'course-ead',
        },
      },
    });
  });

  it('deve mapear o resultado do repositorio para o dto de resposta', () => {
    const birthDate = new Date('2000-05-20T00:00:00.000Z');
    const createdAt = new Date('2026-06-11T17:00:00.000Z');

    expect(
      mapper.toResponse({
        id: 'student-id',
        name: 'Gabriel Silva',
        email: 'gabriel@email.com',
        phone: '(19) 99999-9999',
        cpf: '12345678900',
        birthDate,
        graduationYear: '2024',
        createdAt,
        updatedAt: createdAt,
        enrollments: [{ courseId: 'course-presencial-manha' }],
      }),
    ).toEqual({
      id: 'student-id',
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      phone: '(19) 99999-9999',
      cpf: '12345678900',
      birthDate,
      enrolments: [{ courseId: 'course-presencial-manha' }],
      createdAt,
    });
  });
});
