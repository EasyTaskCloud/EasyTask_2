import { Component, Input, OnChanges, Signal, SimpleChanges } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { type NewTask } from './new-task/new-task.model';
import { Task } from './task/task.model';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskComponent, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnChanges{
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) name!: string;
  isAddingTask = false;
  selectedUserTasksSignal!: Signal<Task[]>;
  /*private tasksService: TasksService;  Dependency Injection */

  /* Dependency Injection shortcut */
  constructor(private tasksService: TasksService) {}
  /* Dependency Injection 
  constructor( tasksService: TasksService) {*/
  /*this.tasksService = tasksService;  Dependency Injection 
  }*/

   ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      // Stelle sicher, dass Tasks geladen werden (nur 1 API Aufruf)
      this.tasksService.ensureUserTasks(this.userId);
      // Hole das Signal für diese userId (computed reference)
      this.selectedUserTasksSignal = this.tasksService.getUserTasksSignal(this.userId);
    }
  }
  onAddNewTask() {
    this.isAddingTask = true;
  }

  onCloseAddTask() {
    this.isAddingTask = false;
  }
}
