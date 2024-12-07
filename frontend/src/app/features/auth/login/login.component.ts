import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../../Material.Module';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/actions/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginImage = 'assets/pages/login-security.png';
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  errorMessageEmail = signal('');
  errorMessagePassword = signal('');
  hide = signal(true);

  constructor(private store: Store) {
    merge(this.email.statusChanges, this.password.statusChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessages());
  }

  updateErrorMessages() {
    this.errorMessageEmail.set(
      this.email.touched && this.email.invalid
        ? this.email.hasError('required')
          ? 'Email is required.'
          : 'Please enter a valid email address.'
        : ''
    );

    this.errorMessagePassword.set(
      this.password.touched && this.password.invalid
        ? 'Password is required.'
        : ''
    );
  }

  toggleVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onLogin() {
    if (this.email.invalid || this.password.invalid) {
      this.updateErrorMessages();
      return;
    }
    const { email, password } = {
      email: this.email.value!,
      password: this.password.value!,
    };
    this.store.dispatch(AuthActions.login({ email, password }));
  }
}
