import { computed, Injectable, Signal, signal } from '@angular/core';
import { type Task } from './task/task.model';
import { NewTask } from './new-task/new-task.model';
import { ApiService } from '../config/api.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' }) /* Dependency Injection */
export class TasksService {
  private userTasksMap = signal<Record<string, Task[]>>({});
/*   private loadingMap = signal<Record<string, boolean>>({}); */
  private tasks = [
    {
      id: 't1',
      userId: 'u1',
      title: 'Master Angular',
      summary:
        'Learn all the basic and advanced features of Angular & how to apply them.',
      dueDate: '2025-12-31',
    },
    {
      id: 't2',
      userId: 'u3',
      title: 'Build first prototype',
      summary: 'Build a first prototype of the online shop website',
      dueDate: '2024-05-31',
    },
    {
      id: 't3',
      userId: 'u3',
      title: 'Prepare issue template',
      summary:
        'Prepare and describe an issue template which will help with project management',
      dueDate: '2024-06-15',
    },
  ];

  constructor(private apiService: ApiService) {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }

    getUserTasksSignal(userId: string): Signal<Task[]> {
    return computed(() => {
      const map = this.userTasksMap();
      return map[userId] ?? [];
    });
  }

  getUserTasks(userId: string) {
    return this.tasks.filter((task) => task.userId === userId);
  }

  addTask(taskData: NewTask, userId: string) {
     const body = {
    userId: userId,
    title: taskData.title,
    summary: taskData.summery, 
    dueDate: taskData.date
  };

    this.apiService.createTask(body).subscribe({
    next: (newTask) => {
      // Backend gibt dir das erstellte Task mit ID zurück
      this.reloadUserTasks(userId); // UI direkt aktualisieren
    },
    error: (err) => {
      console.error('Fehler beim Erstellen des Tasks', err);
    }
  });
  }

  private reloadUserTasks(userId: string) {
  this.apiService.getTodosByUserId(userId).subscribe({
    next: (tasks: Task[]) => {
      const newMap = { ...this.userTasksMap() };
      newMap[userId] = tasks ?? [];
      this.userTasksMap.set(newMap);
    },
    error: (err) => {
      console.error('Fehler beim Neuladen der Tasks', err);
    }
  });
}

   // Prüft cache; wenn nicht vorhanden, lädt von API und setzt das Signal.
  ensureUserTasks(userId: string): void {
    if (!userId) return;
    const map = this.userTasksMap();
    if (map[userId]) {
      // schon geladen -> nichts tun
      return;
    }

    // set loading flag
/*     const lm = { ...this.loadingMap() };
    lm[userId] = true;
    this.loadingMap.set(lm); */

    // API-Aufruf einmalig (subscribe einmal)
    this.apiService.getTodosByUserId(userId)
      .pipe(
        tap(() => {
          // nach dem Resultat loading false setzen wird unten gemacht
        })
      )
      .subscribe({
        next: (tasks: Task[]) => {
          const newMap = { ...this.userTasksMap() };
          newMap[userId] = tasks ?? [];
          this.userTasksMap.set(newMap);

/*           const newLm = { ...this.loadingMap() };
          newLm[userId] = false;
          this.loadingMap.set(newLm); */
        },
        error: (err) => {
          console.error('Fehler beim Laden der Tasks für', userId, err);
/*           const newLm = { ...this.loadingMap() };
          newLm[userId] = false;
          this.loadingMap.set(newLm); */
          // optional: setze newMap[userId] = [] oder behalte undefined
        }
      });
  }

removeTask(id: string, userId: string) {
  this.apiService.deleteTodo(id).subscribe({
    next: () => {
      // Direkt aus dem Signal entfernen (ohne API-Aufruf)
      const currentMap = this.userTasksMap();
      if (currentMap[userId]) {
        const updatedUserTasks = currentMap[userId].filter(task => task.id !== id);
        this.userTasksMap.set({
          ...currentMap,
          [userId]: updatedUserTasks
        });
      }
    },
    error: (err) => {
      console.error('Fehler beim Löschen: ', err);
    }
  });
}

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
