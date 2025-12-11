import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Task {
  id: number;
  title: string;
  done: boolean;
  date: string;
  status: 'todo' | 'in_progress' | 'completed';
  comment: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];

  @Output() taskToggled = new EventEmitter<Task>();
  @Output() taskAdded = new EventEmitter<string>();
  @Output() taskDeleted = new EventEmitter<Task>();

  newTaskTitle = '';

  showTodoSection = true;
  showInProgressSection = true;
  showCompletedSection = true;

  onToggle(task: Task): void {
    this.taskToggled.emit(task);
  }

  onAddTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) {
      return;
    }
    this.taskAdded.emit(title);
    this.newTaskTitle = '';
  }

  onDeleteTask(task: Task): void {
    this.taskDeleted.emit(task);
  }

  toggleSection(section: Task['status']): void {
    switch (section) {
      case 'todo':
        this.showTodoSection = !this.showTodoSection;
        break;
      case 'in_progress':
        this.showInProgressSection = !this.showInProgressSection;
        break;
      case 'completed':
        this.showCompletedSection = !this.showCompletedSection;
        break;
    }
  }

  getStatusIcon(status: Task['status']): string {
    switch (status) {
      case 'todo':
        return '🔵';
      case 'in_progress':
        return '🟡';
      case 'completed':
        return '✅';
      default:
        return '🔘';
    }
  }

  get todoTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'todo');
  }

  get inProgressTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'in_progress');
  }

  get completedTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'completed');
  }
}
