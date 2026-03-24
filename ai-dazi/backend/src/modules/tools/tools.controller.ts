import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ToolsService } from './tools.service';

@ApiTags('工具管理')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post()
  @ApiOperation({ summary: '创建工具' })
  create(@Body() createToolDto: any) {
    return this.toolsService.create(createToolDto);
  }

  @Get()
  @ApiOperation({ summary: '获取工具列表' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.toolsService.findAll({
      category,
      search,
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 20,
    });
  }

  @Get('hot')
  @ApiOperation({ summary: '获取热门工具' })
  findHot() {
    return this.toolsService.findHot();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个工具' })
  findOne(@Param('id') id: string) {
    return this.toolsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新工具' })
  update(@Param('id') id: string, @Body() updateToolDto: any) {
    return this.toolsService.update(id, updateToolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除工具' })
  remove(@Param('id') id: string) {
    return this.toolsService.remove(id);
  }
}
