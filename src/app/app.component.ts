import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WorkspaceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my_app';
}
