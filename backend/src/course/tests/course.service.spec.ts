import { CourseService } from '../course.service';

describe('CourseService', () => {
  let service: CourseService;
  let repository: {
    getCourses: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      getCourses: jest.fn(),
    };

    service = new CourseService(repository as never);
  });

  it('deve retornar os cursos a partir do repositorio', async () => {
    const courses = [{ id: 'course-presencial-manha' }];
    repository.getCourses.mockResolvedValue(courses);

    await expect(service.getCourses()).resolves.toEqual(courses);
    expect(repository.getCourses).toHaveBeenCalledTimes(1);
  });
});
