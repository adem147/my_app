import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Task {
  id: number;
  title: string;
  done: boolean;
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
}
