import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../shared/validators';
import { UserHttpService } from '../shared/services/users.http.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mode } from './mode';
import { UserDto } from '../shared/dtos/user.dto';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent {
  private _snackBar = inject(MatSnackBar);
  readonly dialogRef = inject(MatDialogRef<CreateUserComponent>);
  form!: FormGroup;

  getCtrlErrors(ctrlName: string, errorName: string) {
    const ctrl = this.form.get(ctrlName);
    return ctrl?.invalid && (ctrl.dirty || ctrl.touched) && ctrl.errors && ctrl.errors[errorName];
  }

  getTitle() {
    return this.data.mode == Mode.Create ? 'Create' : 'Update';
  }

  constructor(
    private formBuilder: FormBuilder,
    private httpSvc: UserHttpService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: Mode; user: Partial<UserDto> }
  ) {
    this.form = this.formBuilder.group({
      name: [
        data.mode == Mode.Create ? '' : data.user.name,
        [Validators.required, Validators.pattern(/\S+/)],
      ],
      email: [
        data.mode == Mode.Create ? '' : data.user.email,
        [Validators.required, CustomValidators.email()],
      ],
      phone_number: [
        data.mode == Mode.Create ? '' : data.user.phone_number,
        [Validators.required, CustomValidators.phone_number()],
      ],
    });
  }

  submit() {
    if (this.data.mode == Mode.Create) {
      this.httpSvc.createUser(this.form.value).subscribe({
        next: (u) => {
          this._snackBar.open(`user with id ${u.id} was created`, undefined, {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.dialogRef.close(u.id);
        },
        error: () => this.dialogRef.close(),
      });
    } else {
      this.httpSvc.updateUser(this.data.user.id!, this.form.value).subscribe({
        next: (u) => {
          this._snackBar.open(`user with id ${u.id} was updated`, undefined, {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.dialogRef.close(u.id);
        },
        error: () => this.dialogRef.close(),
      });
    }
  }
}
