import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import request from 'supertest';
import { CourseController } from '../src/course/course.controller';
import { CourseRepository } from '../src/course/course.repository';
import { CourseService } from '../src/course/course.service';
import { StudentController } from '../src/student/student.controller';
import { StudentMapper } from '../src/student/student.mapper';
import { StudentRepository } from '../src/student/student.repository';
import { StudentService } from '../src/student/student.service';

describe('API integration', () => {
  let app: NestFastifyApplication;
  let studentRepository: {
    enrollStudent: jest.Mock;
    validateStudantCourse: jest.Mock;
  };
  let courseRepository: {
    getCourses: jest.Mock;
  };

  beforeEach(async () => {
    studentRepository = {
      enrollStudent: jest.fn(),
      validateStudantCourse: jest.fn(),
    };

    courseRepository = {
      getCourses: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StudentController, CourseController],
      providers: [
        StudentService,
        StudentMapper,
        CourseService,
        {
          provide: StudentRepository,
          useValue: studentRepository,
        },
        {
          provide: CourseRepository,
          useValue: courseRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/course returns the available courses', async () => {
    courseRepository.getCourses.mockResolvedValue([
      {
        id: 'course-presencial-manha',
        name: 'Presencial - Manha',
        modality: 'PRESENCIAL',
        campus: 'CAMPINAS - VILA INDUSTRIAL',
        address: 'RUA DR. SALES DE OLIVEIRA, No 1661 - VILA INDUSTRIAL - CAMPINAS',
        prices: [],
      },
    ]);

    const response = await request(app.getHttpServer())
      .get('/api/course')
      .expect(200);

    expect(response.body).toEqual([
      {
        id: 'course-presencial-manha',
        name: 'Presencial - Manha',
        modality: 'PRESENCIAL',
        campus: 'CAMPINAS - VILA INDUSTRIAL',
        address: 'RUA DR. SALES DE OLIVEIRA, No 1661 - VILA INDUSTRIAL - CAMPINAS',
        prices: [],
      },
    ]);
  });

  it('POST /api/student/enroll returns the enrolled student for a valid payload', async () => {
    studentRepository.validateStudantCourse.mockResolvedValue(null);
    studentRepository.enrollStudent.mockResolvedValue({
      id: 'student-id',
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      phone: '(19) 99999-9999',
      cpf: '529.982.247-25',
      birthDate: new Date('2000-05-20T00:00:00.000Z'),
      graduationYear: '2024',
      createdAt: new Date('2026-06-11T17:00:00.000Z'),
      updatedAt: new Date('2026-06-11T17:00:00.000Z'),
      enrollments: [{ courseId: 'course-presencial-manha' }],
    });

    const response = await request(app.getHttpServer())
      .post('/api/student/enroll')
      .send({
        name: 'Gabriel Silva',
        email: 'gabriel@email.com',
        phone: '(19) 99999-9999',
        cpf: '529.982.247-25',
        birthDate: '2000-05-20T00:00:00.000Z',
        graduationYear: '2024',
        courseId: 'course-presencial-manha',
        priceId: 'course-price-18x',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: 'student-id',
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      phone: '(19) 99999-9999',
      cpf: '529.982.247-25',
      enrolments: [{ courseId: 'course-presencial-manha' }],
    });
  });

  it('POST /api/student/enroll returns validation errors for malformed requests', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/student/enroll')
      .send({
        name: 'Gabriel Silva',
        phone: '(19) 99999-9999',
        cpf: '529.982.247-25',
        birthDate: 'invalid-date',
        graduationYear: '2024',
        courseId: 'course-presencial-manha',
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'email should not be empty',
        'email must be an email',
        'birthDate must be a Date instance',
      ]),
    );
  });

  it('POST /api/student/enroll returns business validation errors', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/student/enroll')
      .send({
        name: 'Gabriel Silva',
        email: 'gabriel@email.com',
        phone: '(19) 99999-9999',
        cpf: '111.111.111-11',
        birthDate: '2000-05-20T00:00:00.000Z',
        graduationYear: '2024',
        courseId: 'course-presencial-manha',
      })
      .expect(400);

    expect(response.body.message).toBe('Informe um CPF valido');
  });
});
