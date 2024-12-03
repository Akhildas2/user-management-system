import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../../Material.Module';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/actions/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corrected 'styleUrls'
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginImage: string = 'assets/pages/login-security.png';

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  errorMessageEmail = signal('');
  errorMessagePassword = signal('');

  hide = signal(true);

  constructor(
    private store: Store,
  ) {
    merge(
      this.email.statusChanges,
      this.email.valueChanges,
      this.password.statusChanges,
      this.password.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    // Email error message
    if (this.email.invalid && this.email.touched) {
      if (this.email.hasError('required')) {
        this.errorMessageEmail.set('Email is required.');
      } else if (this.email.hasError('email')) {
        this.errorMessageEmail.set('Please enter a valid email address.');
      }
    } else {
      this.errorMessageEmail.set('');
    }

    // Password error message
    if (this.password.invalid && this.password.touched) {
      if (this.password.hasError('required')) {
        this.errorMessagePassword.set('Password is required.');
      } else if (this.password.hasError('minlength')) {
        this.errorMessagePassword.set('Password must be at least 6 characters long.');
      }
    } else {
      this.errorMessagePassword.set('');
    }
  }

  // Toggle password visibility
  toggleVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // 
  isFormValid(): boolean {
    return this.email.valid && this.password.valid;
  }

  // Handle login submission
  onLogin() {
    if (this.email.invalid || this.password.invalid) {
      this.updateErrorMessage();
      return;
    }

    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';

    // Dispatch login action
    this.store.dispatch(AuthActions.login({
      email: emailValue,
      password: passwordValue
    }));
  }
}
