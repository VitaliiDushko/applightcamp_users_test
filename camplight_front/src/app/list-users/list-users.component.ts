import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
    MatSnackBarModule,
  ],
  selector: 'app-user-list',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit {
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'email', 'phone_number', 'actions'];
  dataSource = new MatTableDataSource<UserDto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterValue = '';
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  currentFilter: Partial<UserDto> = {};

  filteredUsers: UserDto[] = [];

  constructor(private httpSvc: UserHttpService) {
    this.dataSource.filterPredicate = (user: UserDto, filter: string) =>
      user.email?.includes(filter) ||
      user.name?.includes(filter) ||
      user.phone_number?.includes(filter);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  applyName(name: string) {
    this.currentFilter.name = name;
  }
  applyEmail(email: string) {
    this.currentFilter.email = email;
  }
  applyPhone(phone: string) {
    this.currentFilter.phone_number = phone;
  }

  searchWithFilter(page = 1): void {
    this.httpSvc.getUsers(page, this.pageSize, this.currentFilter).subscribe((response) => {
      this.dataSource.data = response.data;
      this.totalItems = response.total;
      this.paginator.pageIndex = 0;
      this.dataSource.sort = this.sort;
    });
  }

  loadUsers(): void {
    this.httpSvc.getUsers().subscribe((response) => {
      this.dataSource.data = response.data;
      this.totalItems = response.total;
      this.dataSource.sort = this.sort;
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.httpSvc
      .getUsers(this.currentPage, this.pageSize, this.currentFilter)
      .subscribe((response) => {
        this.dataSource.data = response.data;
        this.totalItems = response.total; // Set the total items count for the paginator
        this.dataSource.sort = this.sort;
      });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.httpSvc.deleteUser(id).subscribe(() => {
        this.searchWithFilter(this.currentPage);
      });
    }
  }

  updateUser(user: UserDto): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: {
        mode: Mode.Update,
        user: user,
      },
    });
    dialogRef.afterClosed().subscribe((res) => res && this.searchWithFilter(this.currentPage));
  }

  createUser() {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: {
        mode: Mode.Create,
      },
    });
    dialogRef.afterClosed().subscribe((res) => res && this.searchWithFilter(this.currentPage));
  }
}
