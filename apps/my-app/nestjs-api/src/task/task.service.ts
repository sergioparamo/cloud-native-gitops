import { Injectable } from '@nestjs/common';

export class Task {
  id: number;
  title: string;
  done: boolean;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: 1, title: 'Learn Kubernetes and GitOps', done: true },
    { id: 2, title: 'Master NestJS modules', done: false },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  create(title: string): Task {
    const newTask: Task = { id: this.tasks.length + 1, title, done: false };
    this.tasks.push(newTask);
    return newTask;
  }

  delete(id: number): { message: string } {
    this.tasks = this.tasks.filter(task => task.id !== id);
    return { message: `Task ${id} successfully deleted.` };
  }
}