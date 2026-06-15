import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TasksService, Task } from './task.service';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  healthCheck() {
    return { status: 'UP', message: '🚀 NestJS API running natively inside Kubernetes!' };
  }

  @Get('tasks')
  getTasks(): Task[] {
    return this.tasksService.findAll();
  }

  @Post('tasks')
  createTask(@Body('title') title: string): Task {
    return this.tasksService.create(title);
  }

  @Delete('tasks/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.delete(id);
  }
}