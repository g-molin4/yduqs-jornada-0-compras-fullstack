import { CourseRepository } from '../course.repository';

describe('CourseRepository', () => {
  let repository: CourseRepository;
  let prisma: {
    course: {
      findMany: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      course: {
        findMany: jest.fn(),
      },
    };

    repository = new CourseRepository(prisma as never);
  });

  it('deve buscar cursos com a projecao esperada', async () => {
    const courses = [{ id: 'course-1' }];
    prisma.course.findMany.mockResolvedValue(courses);

    await expect(repository.getCourses()).resolves.toEqual(courses);

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        modality: true,
        campus: true,
        address: true,
        prices: {
          select: {
            id: true,
            name: true,
            totalPrice: true,
            installments: true,
            discount: true,
            price: true,
          },
        },
      },
    });
  });
});
