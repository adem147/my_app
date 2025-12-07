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
  @Input() spaces: any[] = [];
  @Input() selectedSpace!: any;
  @Input() selectedList!: any;

  @Output() spaceSelected = new EventEmitter<any>();
  @Output() listSelected = new EventEmitter<any>();

  onSpaceClick(space: any): void {
    this.spaceSelected.emit(space);
  }

  onListClick(list: any, event: MouseEvent): void {
    event.stopPropagation();
    this.listSelected.emit(list);
  }
}
