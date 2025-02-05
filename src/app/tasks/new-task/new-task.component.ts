import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type NewTask } from './new-task.model';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  @Input({ required: true }) userId!: string;
  @Output() close = new EventEmitter<void>();
  enteredTitle = '';
  enteredSummery = '';
  enterdDate = '';
  /* Alternative Dependency Injection Mechanism */
  private tasksService = inject(TasksService);
  /*  enteredTitle = signal('');
  enteredSummery = signal('');
  enterdDate = signal(''); */

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    this.tasksService.addTask(
      {
        title: this.enteredTitle,
        summery: this.enteredSummery,
        date: this.enterdDate,
      },
      this.userId
    );
    this.close.emit();
  }
}
