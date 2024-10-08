import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserComponent } from './create-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';

describe('CreateUserComponent - Update Mode', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let submitButton: DebugElement;

  const mockDialogData = {
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone_number: '1234567890',
    },
    mode: 'Update', // We're testing the "Update" mode
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateUserComponent, // Import standalone component
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        BrowserAnimationsModule, // Required for Material components
        HttpClientTestingModule, // Add HttpClientTestingModule to resolve HttpClient dependency
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }, // Provide mock dialog data for update mode
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

  it('should have a form initialized with the injected user data in update mode', () => {
    // Check if the form is initialized with the values passed via MAT_DIALOG_DATA
    expect(component.form.controls['name'].value).toBe('John Doe');
    expect(component.form.controls['email'].value).toBe('john.doe@example.com');
    expect(component.form.controls['phone_number'].value).toBe('1234567890');
  });

  it('should disable the submit button if form is invalid in update mode', () => {
    // Set the form to invalid by clearing the name field
    component.form.controls['name'].setValue('');
    fixture.detectChanges();

    expect(component.form.invalid).toBeTrue();
    expect(submitButton.nativeElement.disabled).toBeTrue();
  });

  it('should enable the submit button when the form is valid in update mode', () => {
    // Ensure form is valid with pre-populated data
    component.form.controls['name'].setValue('John Doe');
    component.form.controls['email'].setValue('john.doe@example.com');
    component.form.controls['phone_number'].setValue('1234567890');

    fixture.detectChanges(); // Trigger change detection to update UI

    expect(component.form.valid).toBeTrue();
    expect(submitButton.nativeElement.disabled).toBeFalse();
  });

  it('should call submit() when the form is valid and submit button is clicked in update mode', () => {
    spyOn(component, 'submit');

    component.form.controls['name'].setValue('John Doe');
    component.form.controls['email'].setValue('john.doe@example.com');
    component.form.controls['phone_number'].setValue('1234567890');

    fixture.detectChanges(); // Trigger change detection to update UI

    submitButton.nativeElement.click(); // Simulate button click

    expect(component.submit).toHaveBeenCalled(); // Expect submit() to be called
  });

  it('should update the user with valid form data', () => {
    spyOn(component, 'submit').and.callThrough(); // Spy on submit method and call it

    // Update form values for user
    component.form.controls['name'].setValue('Jane Doe');
    component.form.controls['email'].setValue('jane.doe@example.com');
    component.form.controls['phone_number'].setValue('0987654321');

    fixture.detectChanges(); // Trigger change detection

    submitButton.nativeElement.click(); // Simulate button click

    expect(component.form.controls['name'].value).toBe('Jane Doe');
    expect(component.form.controls['email'].value).toBe('jane.doe@example.com');
    expect(component.form.controls['phone_number'].value).toBe('0987654321');
  });
});
