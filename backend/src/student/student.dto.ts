import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentEnrollmentDTO {
  @ApiProperty({
    example: 'course-presencial-manha',
    description: 'Id do curso escolhido para a matricula',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}

export class CreateStudentDTO {
  @ApiProperty({
    example: 'Gabriel Silva',
    description: 'Nome completo do aluno',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'gabriel@email.com',
    description: 'Email do aluno',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '(19) 99999-9999',
    description: 'Telefone do aluno',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '12345678900',
    description: 'CPF do aluno',
  })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    example: '2000-05-20T00:00:00.000Z',
    description: 'Data de nascimento do aluno',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    example: '2024',
    description:
      'Ano previsto ou real de conclusao do ensino medio/graduacao anterior',
  })
  @IsString()
  @IsNotEmpty()
  graduationYear: string;

  @ApiProperty({
    example: 'course-presencial-manha',
    description: 'Id do curso escolhido',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiPropertyOptional({
    example: 'course-price-18x',
    description: 'Id da opcao de preco/parcela escolhida',
  })
  @IsString()
  @IsOptional()
  priceId?: string;
}
export class StudentResponseDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: Date;
  enrolments: EnrollmentsResponseDTO[];
  createdAt: Date;
}
export class EnrollmentsResponseDTO {
  courseId: string;
}
