import { Module } from '@nestjs/common';
import { TasksService } from './task/task.service';
import { TasksController } from './task/task.controller';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [TasksService],
})
export class AppModule {}
