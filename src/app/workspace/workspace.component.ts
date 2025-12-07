import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TaskListComponent } from '../task-list/task-list.component';

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

interface Space {
  id: number;
  name: string;
  lists: TaskList[];
}

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TaskListComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
  spaces: Space[] = [
    {
      id: 1,
      name: 'Personal',
      lists: [
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
      lists: [
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

  selectedSpace: Space = this.spaces[0];
  selectedList: TaskList = this.spaces[0].lists[0];

  onSpaceSelected(space: Space): void {
    this.selectedSpace = space;
    this.selectedList = space.lists[0];
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
