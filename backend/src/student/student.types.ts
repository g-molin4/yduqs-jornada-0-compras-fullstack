import { Prisma } from '@prisma/client';

export type CreateStudentInput = Prisma.StudentCreateInput;

export type StudentWithCourse = Prisma.StudentGetPayload<{
  include: {
    enrollments: {
      select: {
        courseId: true;
      };
    };
  };
}>;
