import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './list-users.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserHttpService } from '../shared/services/users.http.service';
import { of } from 'rxjs';
import { UserDto } from '../shared/dtos/user.dto';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ListUsersComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let httpService: UserHttpService;

  const mockUserList: UserDto[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone_number: '1234567890' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone_number: '0987654321' },
  ];

  const mockResponse = {
    data: mockUserList,
    total: 2,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserListComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [UserHttpService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    httpService = TestBed.inject(UserHttpService);

    spyOn(httpService, 'getUsers').and.returnValue(of(mockResponse));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(httpService.getUsers).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should handle pagination', () => {
    const paginator = component.paginator;
    paginator.pageSize = 1;
    paginator.pageIndex = 1;

    component.onPageChange({
      pageIndex: 1,
      pageSize: 1,
      length: 2,
    });

    fixture.detectChanges();

    expect(component.currentPage).toBe(2);
  });

  it('should delete a user', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(httpService, 'deleteUser').and.returnValue(of());

    component.deleteUser('1');
    fixture.detectChanges();

    expect(httpService.deleteUser).toHaveBeenCalledWith('1');
  });

  it('should open update user dialog when the update button is clicked', () => {
    spyOn(component, 'updateUser').and.callThrough();

    const updateButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    updateButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.updateUser).toHaveBeenCalled();
  });
});
