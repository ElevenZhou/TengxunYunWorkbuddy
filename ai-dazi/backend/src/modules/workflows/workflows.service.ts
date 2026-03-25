import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.workflow.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    category?: string;
  }) {
    const { skip = 0, take = 20, category } = params;
    
    const where: any = { status: 'PUBLISHED' };
    if (category) {
      where.category = { slug: category };
    }

    const [workflows, total] = await Promise.all([
      this.prisma.workflow.findMany({
        where,
        skip,
        take,
        include: { 
          category: true, 
          author: { select: { id: true, name: true, avatar: true } },
          tags: true 
        },
        orderBy: { useCount: 'desc' },
      }),
      this.prisma.workflow.count({ where }),
    ]);

    return { workflows, total, skip, take };
  }

  async findOne(id: string) {
    // 增加使用次数
    await this.prisma.workflow.update({
      where: { id },
      data: { useCount: { increment: 1 } },
    });

    return this.prisma.workflow.findUnique({
      where: { id },
      include: { 
        category: true, 
        author: { select: { id: true, name: true, avatar: true } },
        tags: true,
        _count: { select: { Favorite: true } },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.workflow.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.workflow.delete({ where: { id } });
  }

  async copy(id: string, userId: string) {
    const original = await this.prisma.workflow.findUnique({ where: { id } });
    if (!original) return null;
    
    return this.prisma.workflow.create({
      data: {
        ...original,
        id: undefined,
        title: `${original.title} (副本)`,
        authorId: userId,
        useCount: 0,
        status: 'DRAFT',
      },
    });
  }
}
