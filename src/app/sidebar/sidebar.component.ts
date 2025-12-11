import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() boards: any[] = [];
  @Input() selectedBoard!: any;
  @Input() selectedList!: any;
  @Input() selectedTask!: any;

  @Output() boardSelected = new EventEmitter<any>();
  @Output() listSelected = new EventEmitter<any>();
  @Output() taskSelected = new EventEmitter<any>();

  onBoardClick(board: any): void {
    this.boardSelected.emit(board);
  }

  onListClick(list: any, event: MouseEvent): void {
    event.stopPropagation();
    this.listSelected.emit(list);
  }

  onTaskClick(task: any, event: MouseEvent): void {
    event.stopPropagation();
    this.taskSelected.emit(task);
  }
}
