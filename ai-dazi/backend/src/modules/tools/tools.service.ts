import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.tool.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    category?: string;
    search?: string;
  }) {
    const { skip = 0, take = 20, category, search } = params;
    
    const where: any = {};
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [tools, total] = await Promise.all([
      this.prisma.tool.findMany({
        where: { status: 'approved', ...where },
        skip,
        take,
        include: { category: true, tags: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tool.count({ where: { status: 'approved', ...where } }),
    ]);

    return { tools, total, skip, take };
  }

  async findOne(id: string) {
    // 增加浏览量
    await this.prisma.tool.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return this.prisma.tool.findUnique({
      where: { id },
      include: { 
        category: true, 
        tags: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
        _count: { select: { reviews: true, favorites: true } },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.tool.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.tool.delete({ where: { id } });
  }

  async findHot() {
    return this.prisma.tool.findMany({
      where: { status: 'APPROVED' },
      take: 10,
      orderBy: { viewCount: 'desc' },
      include: { category: true },
    });
  }
}
