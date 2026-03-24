import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';

@ApiTags('工作流管理')
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @ApiOperation({ summary: '创建工作流' })
  create(@Body() createWorkflowDto: any) {
    return this.workflowsService.create(createWorkflowDto);
  }

  @Get()
  @ApiOperation({ summary: '获取工作流列表' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  findAll(
    @Query('category') category?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.workflowsService.findAll({
      category,
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个工作流' })
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新工作流' })
  update(@Param('id') id: string, @Body() updateWorkflowDto: any) {
    return this.workflowsService.update(id, updateWorkflowDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除工作流' })
  remove(@Param('id') id: string) {
    return this.workflowsService.remove(id);
  }

  @Post(':id/copy')
  @ApiOperation({ summary: '复制工作流' })
  copy(@Param('id') id: string, @Body('userId') userId: string) {
    return this.workflowsService.copy(id, userId);
  }
}
