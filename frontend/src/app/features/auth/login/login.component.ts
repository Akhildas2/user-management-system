import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../../Material.Module';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginImage: string = 'assets/pages/login-security.png';

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  errorMessageEmail = signal('');
  errorMessagePassword = signal('');

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges, this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    // Check email validation errors
    if (this.email.invalid && (this.email.dirty || this.email.touched)) {
      if (this.email.hasError('required')) {
        this.errorMessageEmail.set('You must enter a value');
      } else if (this.email.hasError('email')) {
        this.errorMessageEmail.set('Not a valid email');
      } else {
        this.errorMessageEmail.set('');
      }
    } else {
      this.errorMessageEmail.set('');
    }

    // Check password validation errors
    if (this.password.invalid && (this.password.dirty || this.password.touched)) {
      if (this.password.hasError('required')) {
        this.errorMessagePassword.set('Password is required');
      } else if (this.password.errors && 'minlength' in this.password.errors) {
        this.errorMessagePassword.set(
          `Password should be at least ${this.password.errors['minlength'].requiredLength} characters`
        );
      } else {
        this.errorMessagePassword.set('');
      }
    } else {
      this.errorMessagePassword.set('');
    }
  }


  hide = signal(true);

  toggleVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
