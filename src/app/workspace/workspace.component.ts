import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

interface TaskList {
  id: number;
  name: string;
  tasks: Task[];
}

interface Board {
  id: number;
  name: string;
  taskLists: TaskList[];
}

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
  boards: Board[] = [
    {
      id: 1,
      name: 'Project 1',
      taskLists: [
        {
          id: 1,
          name: 'To Do',
          tasks: [
            { id: 1, title: 'Buy groceries', done: false },
            { id: 2, title: 'Study Angular', done: true }
          ]
        },
        {
          id: 2,
          name: 'In Progress',
          tasks: []
        }
      ]
    },
    {
      id: 2,
      name: 'Work',
      taskLists: [
        {
          id: 3,
          name: 'Tasks',
          tasks: [
            { id: 3, title: 'Prepare report', done: false }
          ]
        }
      ]
    }
  ];

  selectedBoard: Board = this.boards[0];
  selectedList: TaskList = this.boards[0].taskLists[0];

  onBoardSelected(space: Board): void {
    this.selectedBoard = space;
    this.selectedList = space.taskLists[0];
  }

  onListSelected(list: TaskList): void {
    this.selectedList = list;
  }

  onTaskToggled(task: Task): void {
    task.done = !task.done;
  }

  onTaskAdded(title: string): void {
    const newId = this.selectedList.tasks.length
      ? Math.max(...this.selectedList.tasks.map(t => t.id)) + 1
      : 1;
    this.selectedList.tasks.push({ id: newId, title, done: false });
  }

  onTaskDeleted(task: Task): void {
    this.selectedList.tasks = this.selectedList.tasks.filter(t => t !== task);
  }
}
