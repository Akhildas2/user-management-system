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

  hide = signal(true);

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges, this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }


  updateErrorMessage() {
    // Update email error message
    if (this.email.invalid && this.email.touched) {
      if (this.email.hasError('required')) {
        this.errorMessageEmail.set('Email is required.');
      } else if (this.email.hasError('email')) {
        this.errorMessageEmail.set('Please enter a valid email address.');
      }
    } else {
      this.errorMessageEmail.set('');
    }

    // Update password error message
    if (this.password.invalid && this.password.touched) {
      if (this.password.hasError('required')) {
        this.errorMessagePassword.set('Password is required.');
      }
    } else {
      this.errorMessagePassword.set('');
    }
  }

  toggleVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
