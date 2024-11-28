import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../../Material.Module';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { merge } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Custom validator to check if passwords match
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  confirmPassword?.setErrors(null);
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  registerImage: string = 'assets/pages/register.png';

  readonly name = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly phone = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]{10}$/)]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)]);

  nameErrorMessage = signal('');
  emailErrorMessage = signal('');
  phoneErrorMessage = signal('');
  passwordErrorMessage = signal('');
  hide = signal(true);

  constructor() {
    merge(
      this.name.statusChanges,
      this.name.valueChanges,
      this.email.statusChanges,
      this.email.valueChanges,
      this.phone.statusChanges,
      this.phone.valueChanges,
      this.password.statusChanges,
      this.password.valueChanges,

    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.updateErrorMessage();
      });
  }

  updateErrorMessage() {
    // Name field
    if (this.name.invalid && (this.name.dirty || this.name.touched)) {
      if (this.name.hasError('required')) {
        this.nameErrorMessage.set('Name is required');
      } else if (this.name.hasError('minlength')) {
        this.nameErrorMessage.set(`Name should be at least ${this.name.errors?.['minlength']?.requiredLength} characters`);
      } else if (this.name.hasError('maxlength')) {
        this.nameErrorMessage.set(`Name should not exceed ${this.name.errors?.['maxlength']?.requiredLength} characters`);
      } else {
        this.nameErrorMessage.set('');
      }
    } else {
      this.nameErrorMessage.set('');
    }

    // Email field
    if (this.email.invalid && (this.email.dirty || this.email.touched)) {
      if (this.email.hasError('required')) {
        this.emailErrorMessage.set('Email is required');
      } else if (this.email.hasError('email')) {
        this.emailErrorMessage.set('Please enter a valid email address');
      } else {
        this.emailErrorMessage.set('');
      }
    } else {
      this.emailErrorMessage.set('');
    }

    // Phone field
    if (this.phone.invalid && (this.phone.dirty || this.phone.touched)) {
      if (this.phone.hasError('required')) {
        this.phoneErrorMessage.set('phone is required');
      } else if (this.phone.hasError('minlength') || this.phone.hasError('maxlength') ) {
        this.phoneErrorMessage.set('Phone number must be exactly 10 digits');
      } else {
        this.phoneErrorMessage.set('');
      }
    } else {
      this.phoneErrorMessage.set('');
    }

    // Password field
    if (this.password.invalid && (this.password.dirty || this.password.touched)) {
      if (this.password.hasError('required')) {
        this.passwordErrorMessage.set('Password is required');
      } else if (this.password.hasError('minlength')) {
        this.passwordErrorMessage.set(`Password should be at least ${this.password.errors?.['minlength']?.requiredLength} characters`);
      } else if (this.password.hasError('pattern')) {
        this.passwordErrorMessage.set('Password should contain at least one letter and one number');
      } else {
        this.passwordErrorMessage.set('');
      }
    } else {
      this.passwordErrorMessage.set('');
    }


  }

  toggleVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}