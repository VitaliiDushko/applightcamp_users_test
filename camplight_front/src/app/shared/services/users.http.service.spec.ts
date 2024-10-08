import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserHttpService } from './users.http.service';
import { UserDto } from '../dtos/user.dto';

describe('UserHttpService', () => {
  let service: UserHttpService;
  let httpMock: HttpTestingController;

  const mockUserList: UserDto[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone_number: '1234567890' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone_number: '0987654321' },
  ];

  const mockUser: UserDto = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '1234567890',
  };

  const mockFindResponse = {
    data: mockUserList,
    total: 2,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserHttpService],
    });

    service = TestBed.inject(UserHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users with pagination and filtering (GET)', () => {
    const page = 1;
    const pageSize = 10;
    const filter = { name: 'John' };

    service.getUsers(page, pageSize, filter).subscribe((response) => {
      expect(response.data).toEqual(mockUserList);
      expect(response.total).toBe(2);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url.includes(`${service.apiUrl}`) &&
        request.params.get('page') === String(page) &&
        request.params.get('limit') === String(pageSize) &&
        request.params.get('name') === filter.name
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockFindResponse);
  });

  it('should fetch a user by ID (GET)', () => {
    const userId = '1';
    service.getUserById(userId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create a user (POST)', () => {
    service.createUser(mockUser).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${service.apiUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should update a user (PUT)', () => {
    const updatedUser = { ...mockUser, name: 'Updated John' };
    service.updateUser(updatedUser.id, updatedUser).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/${updatedUser.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });

  it('should delete a user (DELETE)', () => {
    const userId = '1';
    service.deleteUser(userId).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
