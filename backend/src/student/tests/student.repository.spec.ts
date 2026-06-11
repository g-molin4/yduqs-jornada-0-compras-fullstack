import { StudentRepository } from '../student.repository';

describe('StudentRepository', () => {
  let repository: StudentRepository;
  let prisma: {
    student: {
      create: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      student: {
        create: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    repository = new StudentRepository(prisma as never);
  });

  it('deve criar o estudante incluindo as matriculas', async () => {
    const data = { name: 'Gabriel Silva' };
    const student = { id: 'student-id' };
    prisma.student.create.mockResolvedValue(student);

    await expect(repository.enrollStudent(data as never)).resolves.toEqual(
      student,
    );

    expect(prisma.student.create).toHaveBeenCalledWith({
      data,
      include: {
        enrollments: {
          select: {
            courseId: true,
          },
        },
      },
    });
  });

  it('deve verificar se um estudante ja existe por email ou cpf', async () => {
    const existingStudent = { id: 'student-id' };
    prisma.student.findFirst.mockResolvedValue(existingStudent);

    await expect(
      repository.validateStudantCourse({
        email: 'gabriel@email.com',
        cpf: '12345678900',
      }),
    ).resolves.toEqual(existingStudent);

    expect(prisma.student.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [{ email: 'gabriel@email.com' }, { cpf: '12345678900' }],
      },
    });
  });
});
