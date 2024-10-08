import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserComponent } from './create-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Mode } from './mode';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let submitButton: DebugElement;

  const mockDialogData = {
    mode: Mode.Create,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateUserComponent,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form initialized with name, email, and phone_number controls', () => {
    expect(component.form.contains('name')).toBeTruthy();
    expect(component.form.contains('email')).toBeTruthy();
    expect(component.form.contains('phone_number')).toBeTruthy();
  });

  it('should disable the submit button if form is invalid', () => {
    expect(component.form.invalid).toBeTrue();
    expect(submitButton.nativeElement.disabled).toBeTrue();
  });

  it('should enable the submit button when the form is valid', () => {
    component.form.controls['name'].setValue('John Doe');
    component.form.controls['email'].setValue('john.doe@example.com');
    component.form.controls['phone_number'].setValue('1234567890');

    fixture.detectChanges();

    expect(component.form.valid).toBeTrue();
    expect(submitButton.nativeElement.disabled).toBeFalse();
  });

  it('should show error messages for required fields when form is touched', () => {
    component.form.controls['name'].markAsTouched();
    component.form.controls['email'].markAsTouched();
    component.form.controls['phone_number'].markAsTouched();

    fixture.detectChanges();

    const nameError = fixture.debugElement.query(By.css('mat-error')).nativeElement;
    expect(nameError).toBeTruthy();
    expect(nameError.textContent).toContain('Name is required');

    const emailError = fixture.debugElement.queryAll(By.css('mat-error'))[1].nativeElement;
    expect(emailError).toBeTruthy();
    expect(emailError.textContent).toContain('Email is required');
  });

  it('should call submit() when form is valid and submit button is clicked', () => {
    spyOn(component, 'submit');

    component.form.controls['name'].setValue('John Doe');
    component.form.controls['email'].setValue('john.doe@example.com');
    component.form.controls['phone_number'].setValue('1234567890');

    fixture.detectChanges();

    submitButton.nativeElement.click();

    expect(component.submit).toHaveBeenCalled();
  });
});
