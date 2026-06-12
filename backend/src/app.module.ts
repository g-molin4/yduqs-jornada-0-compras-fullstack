import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PrismaModule } from './infra/prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';
import { PinoLoggerService } from './logger/pino-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StudentModule,
    CourseModule,
  ],
  controllers: [],
  providers: [AppService, PinoLoggerService],
})
export class AppModule {}
