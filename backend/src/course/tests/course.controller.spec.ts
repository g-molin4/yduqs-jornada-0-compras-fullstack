import { CourseController } from '../course.controller';

describe('CourseController', () => {
  let controller: CourseController;
  let service: {
    getCourses: jest.Mock;
  };

  beforeEach(() => {
    service = {
      getCourses: jest.fn(),
    };

    controller = new CourseController(service as never);
  });

  it('deve retornar os cursos a partir do service', async () => {
    const courses = [{ id: 'course-presencial-manha' }];
    service.getCourses.mockResolvedValue(courses);

    await expect(controller.getCourses()).resolves.toEqual(courses);
    expect(service.getCourses).toHaveBeenCalledTimes(1);
  });
});
