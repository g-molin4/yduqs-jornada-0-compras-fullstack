import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateStudentDTO } from '../student.dto';

describe('CreateStudentDTO', () => {
  it('deve aceitar um payload de matricula valido e transformar birthDate', async () => {
    const dto = plainToInstance(CreateStudentDTO, {
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      phone: '(19) 99999-9999',
      cpf: '529.982.247-25',
      birthDate: '2000-05-20T00:00:00.000Z',
      graduationYear: '2024',
      courseId: 'course-presencial-manha',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.birthDate).toBeInstanceOf(Date);
  });

  it('deve marcar campos obrigatorios como invalidos quando ausentes', async () => {
    const dto = plainToInstance(CreateStudentDTO, {});
    const errors = await validate(dto);
    const constrainedFields = errors.map((error) => error.property);

    expect(constrainedFields).toEqual(
      expect.arrayContaining([
        'name',
        'email',
        'phone',
        'cpf',
        'birthDate',
        'graduationYear',
        'courseId',
      ]),
    );
  });

  it('deve tratar priceId como opcional', async () => {
    const dto = plainToInstance(CreateStudentDTO, {
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      phone: '(19) 99999-9999',
      cpf: '529.982.247-25',
      birthDate: '2000-05-20T00:00:00.000Z',
      graduationYear: '2024',
      courseId: 'course-ead',
      priceId: undefined,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
