import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserCreateDto } from '../dtos/user-create.dto';
import { UserDto } from '../dtos/user.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  public readonly apiUrl = 'http://localhost:3000/users'; 
  private _snackBar = inject(MatSnackBar);

  constructor(private http: HttpClient) {}

  createUser(createUserDto: UserCreateDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}`, createUserDto).pipe(
      catchError((error) => {
        console.error('Error creating user:', error);
        this._snackBar.open(`Error creating user: ${error.message}`, undefined, {
          duration: 3000, 
          panelClass: ['snackbar-error'], 
        });
        throw error;
      })
    );
  }

  getUsers(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<UserDto>
  ): Observable<{ data: UserDto[]; total: number }> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (filters?.name) {
      params = params.set('name', filters.name);
    }
    if (filters?.email) {
      params = params.set('email', filters.email);
    }
    if (filters?.phone_number) {
      params = params.set('phone_number', filters.phone_number);
    }

    return this.http.get<{ data: UserDto[]; total: number }>(`${this.apiUrl}`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        this._snackBar.open(`Error fetching users: ${error.message}`, undefined, {
          duration: 3000, 
          panelClass: ['snackbar-error'], 
        });
        throw error;
      })
    );
  }

  getUserById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching user with ID ${id}:`, error);
        this._snackBar.open(`Error fetching user with ID ${id}: ${error.message}`, undefined, {
          duration: 3000, 
          panelClass: ['snackbar-error'], 
        });
        throw error;
      })
    );
  }

  updateUser(id: string, updateUserDto: UserCreateDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/${id}`, updateUserDto).pipe(
      catchError((error) => {
        console.error(`Error updating user with ID ${id}:`, error);
        this._snackBar.open(`Error updating user with ID ${id}: ${error.message}`, undefined, {
          duration: 3000, 
          panelClass: ['snackbar-error'], 
        });
        throw error;
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting user with ID ${id}:`, error);
        this._snackBar.open(`Error deleting user with ID ${id}: ${error.message}`, undefined, {
          duration: 3000, 
          panelClass: ['snackbar-error'], 
        });
        throw error;
      })
    );
  }
}