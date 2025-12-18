import { Component, ElementRef, EventEmitter, Output, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskboardComponent } from '../taskboard/taskboard.component';

interface Task {
  id: number;
  title: string;
  done: boolean;
  editing?: boolean;
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
  imports: [CommonModule, TaskboardComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
  boards: Board[] = [
    {
      id: 1,
      name: 'Game Dev',
      taskLists: [
        {
          id: 1,
          name: 'Main Choices',
          tasks: [
            { id: 1, title: 'Game Story', done: false },
            { id: 2, title: "Choosing The Game's Type", done: true },
            { id: 3, title: "Choosing The Engine", done: true }
          ]
        },
        {
          id: 2,
          name: 'Game Design',
          tasks: [
            { id: 4, title: '3D Modeling', done: false },
            { id: 5, title: "Animations", done: true },
            { id: 6, title: "Texturing Models", done: true },
            { id: 45, title: "Game UI", done: true },
            { id: 74, title: "Level Design", done: true }
          ]
        },
        {
          id: 3,
          name: 'Game Experience',
          tasks: [
            { id: 7, title: 'Player Movement', done: false},
            { id: 8, title: 'Camera System', done: false},
            { id: 9, title: 'Combat System', done: false},
            { id: 10, title: 'Character Combat AI', done: false},
            { id: 11, title: 'Interactions With Environment', done: false},
            { id: 12, title: 'Crafting System', done: false},
            { id: 14, title: 'Multiplayer System (Optional)', done: false},
            { id: 15, title: 'NPCs and Civilians', done: false}
          ]
        },
        {
          id: 4,
          name: 'Animations',
          tasks: [
            { id: 14, title: 'Player Animations', done: false},
            { id: 16, title: 'Energy Animations', done: false},
            { id: 19, title: 'NPCs Animations', done: false},
          ]
        },
        {
          id: 5,
          name: 'Doing',
          tasks: [
          ]
        },
        {
          id: 6,
          name: 'Done',
          tasks: [
          ]
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
  isEditingBoardTitle = false;
  private originalBoardTitle = '';
  
  @ViewChild('boardTitleInput') boardTitleInput?: ElementRef<HTMLInputElement>;

  onBoardChange(boardId: number): void {
    const selectedBoard = this.boards.find(board => board.id === boardId);
    if (selectedBoard) {
      this.selectedBoard = selectedBoard;
    }
  }

  onTaskToggled(task: Task): void {
    task.done = !task.done;
  }

  onTaskAdded(event: { task: Task, taskListId: number }): void {
    const { task, taskListId } = event;

    task.editing = true;

    // Find the task list by ID in the selected board
    const taskList = this.selectedBoard.taskLists.find(
      (list: TaskList) => list.id === taskListId
    );
    
    if (taskList) {
      // Generate a unique ID for the new task
      const newId = taskList.tasks.length > 0
        ? Math.max(...taskList.tasks.map((t: Task) => t.id)) + 1
        : 1;
      
      task.id = newId;
      taskList.tasks.push(task);

      setTimeout(() => {
        // This ensures Angular updates the view before we try to focus
        this.focusNewTask(task.id);
      }, 100);
    }
  }

  private focusNewTask(taskId: number): void {
    // Look for the input with data-task-id attribute
    const input = document.querySelector(`[data-task-id="${taskId}"]`) as HTMLInputElement;
    if (input) {
      input.focus();
      input.select();
    } else {
      // Try again if not found
      setTimeout(() => this.focusNewTask(taskId), 50);
    }
  }

  onTaskUpdated(event: { updatedTask: Task, taskListId: number }): void {
    const { updatedTask, taskListId } = event;
    // Find and update the task in all boards
    const taskList = this.selectedBoard.taskLists.find(
      (list: TaskList) => list.id === taskListId
    );
    let taskToUpdate = taskList?.tasks.find(
      (task: Task) => task.id === updatedTask.id
    );
    if (taskToUpdate) {
      taskToUpdate = { ...updatedTask };
    }
  }
  
  getTotalTasks(): number {
    if (!this.selectedBoard?.taskLists) return 0;
    return this.selectedBoard.taskLists.reduce((total: number, list: any) => 
      total + (list.tasks?.length || 0), 0
    );
  }

  onTaskDeleted(event: { task: Task, taskListId: number }): void {
    const { task, taskListId } = event;
    
    // Find the task list
    const taskList = this.selectedBoard.taskLists.find(
      (list: TaskList) => list.id === taskListId
    );
    
    if (taskList) {
      // Remove the task
      taskList.tasks = taskList.tasks.filter((t: Task) => t.id !== task.id);
    }
  }

  startEditingBoardTitle(): void {
    if (!this.selectedBoard) return;
    
    this.isEditingBoardTitle = true;
    this.originalBoardTitle = this.selectedBoard.name;
    
    // Focus the input after view updates
    setTimeout(() => {
      this.boardTitleInput?.nativeElement.focus();
      this.boardTitleInput?.nativeElement.select();
    });
  }
  
  saveBoardTitle(): void {
    if (!this.selectedBoard || !this.boardTitleInput) return;
    
    const newTitle = this.boardTitleInput.nativeElement.value.trim();
    
    if (newTitle && newTitle !== this.selectedBoard.name) {
      // Update the board name
      this.selectedBoard.name = newTitle;
      
      // Here you would typically save to your backend
      this.saveBoardToBackend(this.selectedBoard);
      
      // Also update the boards array
      const boardIndex = this.boards.findIndex(b => b.id === this.selectedBoard?.id);
      if (boardIndex !== -1) {
        this.boards[boardIndex].name = newTitle;
      }
    }
    
    this.isEditingBoardTitle = false;
  }
  
  cancelEditingBoardTitle(): void {
    if (this.selectedBoard) {
      this.selectedBoard.name = this.originalBoardTitle;
    }
    this.isEditingBoardTitle = false;
  }
  
  private saveBoardToBackend(board: any): void {
    // Implement your API call here
    console.log('Saving board:', board);
    // Example:
    // this.boardService.updateBoard(board.id, { name: board.name }).subscribe();
  }
}
