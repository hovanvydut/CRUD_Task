import { Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task } from './entity/task.entity';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  findById(id: number): Promise<Task> {
    return this.taskRepository.findOne({ id });
  }
}
