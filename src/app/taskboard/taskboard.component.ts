import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChildren, QueryList, ElementRef, AfterViewChecked} from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  done: boolean;
  editing?: boolean;
}

@Component({
  selector: 'app-taskboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taskboard.component.html',
  styleUrl: './taskboard.component.css'
})
export class TaskboardComponent implements AfterViewChecked{
  @Input() boards: any[] = [];
  @Input() selectedBoard!: any;

  @Output() boardSelected = new EventEmitter<any>();
  @Output() listSelected = new EventEmitter<any>();
  @Output() taskAdded = new EventEmitter<any>();
  @Output() taskUpdated = new EventEmitter<any>();
  @Output() taskDeleted = new EventEmitter<{task: any, taskListId: number}>();

  @ViewChildren('editInput') editInputs!: QueryList<ElementRef>;
  private originalTitle: string = ''; 
  private taskToFocus: number | null = null;

  onBoardClick(board: any): void {
    this.boardSelected.emit(board);
  }

  onListClick(list: any, event: MouseEvent): void {
    event.stopPropagation();
    this.listSelected.emit(list);
  }

  onTaskClick(task: any, event: MouseEvent): void {
    event.stopPropagation();
  }
  
  onAddListClick(): void {
    const newList = { id: Date.now(), name: 'New List', tasks: [] };
    this.selectedBoard.taskLists.push(newList);
  }


  ngAfterViewChecked(): void {
    if (this.taskToFocus && this.editInputs) {
      // Find the input for the newly added task
      const inputToFocus = this.editInputs.find(input => {
        const taskId = parseInt(input.nativeElement.getAttribute('data-task-id') || '0');
        return taskId === this.taskToFocus;
      });
      
      if (inputToFocus) {
        setTimeout(() => {
          inputToFocus.nativeElement.focus();
          inputToFocus.nativeElement.select(); // Select all text
          this.taskToFocus = null; // Reset focus request
        }, 0);
      }
    }
  }
  
  editTask(task: any): void {
    console.log('Editing task:', task.title);
    this.originalTitle = task.title;
    task.editing = true;
    this.taskToFocus = task.id; 
  }

  // Save changes
  saveTask(task: any, taskListId: number): void {
    if (task.title.trim() === '') {
      task.title = this.originalTitle;
    }
    task.editing = false;
    this.taskUpdated.emit({
      task: task,
      taskListId: taskListId
    });
  }

  // Cancel edit
  cancelEdit(task: any): void {
    task.title = this.originalTitle;
    task.editing = false;
  }

  addTask(title: string, taskListId: number): void {
    this.originalTitle = title;
    const newTask = { 
      id: Date.now(), 
      title, 
      done: false, 
      editing: true  // Make it editable immediately
    };
    
    // Mark this task for focus
    this.taskToFocus = newTask.id;
    
    this.taskAdded.emit({
      task: newTask,
      taskListId: taskListId
    });
  }
  deselectAllTasks(): void {
    for (const list of this.selectedBoard.taskLists) {
      for (const task of list.tasks) {
        task.editing = false;
      }
    }
  }
  
  toggleTaskDone(task: any, taskListId: number): void {
    task.done = !task.done;
    // Optionally emit an event to parent component
    this.taskUpdated.emit({
      updatedTask: task,
      taskListId: taskListId
    });
  }
  
  deleteTask(task: any, taskListId: number): void {
    // Emit delete event to parent component
    this.taskDeleted.emit({
      task: task,
      taskListId: taskListId
    });
    
    // Or remove directly from the list if you prefer
    // const taskList = this.selectedBoard.taskLists.find((list: any) => list.id === taskListId);
    // if (taskList) {
    //   taskList.tasks = taskList.tasks.filter((t: any) => t.id !== task.id);
    // }
  }
}
