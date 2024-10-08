import { Routes } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserListComponent } from './list-users/list-users.component';

export const routes: Routes = [
  {
    title: 'User:list users',
    path: 'users',
    component: UserListComponent,
  },
  {
    title: 'User:create user',
    path: 'create-user',
    component: CreateUserComponent,
  },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
];
