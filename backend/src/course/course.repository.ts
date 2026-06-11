import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class CourseRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getCourses() {
        return this.prisma.course.findMany({
            select: {
                id:true,
                name:true,
                modality:true,
                prices: {
                    select: {
                        id: true,
                        name: true,
                        totalPrice: true,
                        installments: true,
                        discount: true,
                        price: true,
                    }
                },

            },
        });
    }
}
