import {
  Component,
  Input,
  input,
  computed,
  signal,
  EventEmitter,
  Output,
  output,
} from '@angular/core';
import { DUMMY_USERS } from '../dummy-users';
import { type User } from './user.model';
import { CardComponent } from '../shared/card/card.component';

/* type User = {
  //TypeScript Type Aliases Interfaces
  id: string;
  avatar: string;
  name: string;
}; */

/* const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
 */
@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [CardComponent],
})
export class UserComponent {
  @Input({ required: true }) user!: User;
  @Input({ required: true }) selected!: boolean;
  @Output() select = new EventEmitter<string>();
  //select = output<string>();
  /*   avatar = input.required<string>();
  name = input.required<string>(); */

  get imagePath() {
    return 'assets/users/' + this.user.avatar;
  }

  /* public selectedUser = signal(DUMMY_USERS[randomIndex]);
  imagePath = computed(
    () => 'assets/users/' + this.selectedUser().avatar
  );  singnal stuff */

  //Computed value
  /* get imagePath() {
    return 'assets/users/' + this.selectedUser().avatar;
  } */

  onSelectUser() {
    /*     const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser.set(DUMMY_USERS[randomIndex]); */
    this.select.emit(this.user.id);
  }
}
