import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entity/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.findById(id);
  }
}
