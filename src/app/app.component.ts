import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.compoment';
import { UserComponent } from './user/user.component';
import { DUMMY_USERS } from './dummy-users';
import { TasksComponent } from './tasks/tasks.component';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from './config/api.service';
import { User } from './user/user.model';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserComponent, TasksComponent, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  users: User[] = [];
  selectedUserId?: string;

   constructor(private apiService :ApiService){
    apiService.getusers().subscribe(res => {
     this.users = res;
    });
  }
  get selectedUser() {
    return this.users.find((user) => user.id === this.selectedUserId);
  }

  onSelectUser(id: string) {
    this.selectedUserId = id;
  }
}
