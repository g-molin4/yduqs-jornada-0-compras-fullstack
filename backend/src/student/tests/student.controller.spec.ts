import { StudentController } from '../student.controller';
import { CreateStudentDTO } from '../student.dto';

describe('StudentController', () => {
  let controller: StudentController;
  let service: {
    enrollStudent: jest.Mock;
  };

  beforeEach(() => {
    service = {
      enrollStudent: jest.fn(),
    };

    controller = new StudentController(service as never);
  });

  it('deve delegar a matricula para o service', async () => {
    const payload: CreateStudentDTO = {
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      phone: '(19) 99999-9999',
      cpf: '529.982.247-25',
      birthDate: new Date('2000-05-20T00:00:00.000Z'),
      graduationYear: '2024',
      courseId: 'course-presencial-manha',
      priceId: 'course-price-18x',
    };
    const response = { id: 'student-id' };

    service.enrollStudent.mockResolvedValue(response);

    await expect(controller.enrollStudent(payload)).resolves.toEqual(response);
    expect(service.enrollStudent).toHaveBeenCalledWith(payload);
  });
});
