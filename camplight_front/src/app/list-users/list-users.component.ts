import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDto } from '../shared/dtos/user.dto';
import { UserHttpService } from '../shared/services/users.http.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Mode } from '../create-user/mode';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule 
  ],
  selector: 'app-user-list',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class UserListComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'email', 'phone_number', 'actions'];
  dataSource = new MatTableDataSource<UserDto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  filterValue: string = '';

  constructor(private httpSvc: UserHttpService) {
    this.dataSource.filterPredicate = (user: UserDto, filter: string) => user.email.includes(filter) || user.name.includes(filter) || user.phone_number.includes(filter);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Fetch users from the service
  loadUsers(): void {
    this.httpSvc.getUsers().subscribe(
      (response) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  // Apply filter to table
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Delete a user
  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.httpSvc.deleteUser(id).subscribe(
        () => {
          this.loadUsers(); 
        }
      );
    }
  }

  updateUser(user: UserDto): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: {
        mode: Mode.Update,
        user: user
      }
    });
    dialogRef.afterClosed().subscribe(res => res && this.loadUsers())
  }

  createUser() {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: {
        mode: Mode.Create
      }
    });
    dialogRef.afterClosed().subscribe(res => res && this.loadUsers())
  }
}