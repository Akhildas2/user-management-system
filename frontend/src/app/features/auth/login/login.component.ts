import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../../Material.Module';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

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
  errorMessage: string = ''; // To show login error from backend

  hide = signal(true);

  constructor(private authService: AuthService, private route: Router) {
    merge(this.email.statusChanges, this.email.valueChanges, this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }


  updateErrorMessage() {
    // email error message
    if (this.email.invalid && this.email.touched) {
      if (this.email.hasError('required')) {
        this.errorMessageEmail.set('Email is required.');
      } else if (this.email.hasError('email')) {
        this.errorMessageEmail.set('Please enter a valid email address.');
      }
    } else {
      this.errorMessageEmail.set('');
    }

    // password error message
    if (this.password.invalid && this.password.touched) {
      if (this.password.hasError('required')) {
        this.errorMessagePassword.set('Password is required.');
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

  // Handle login form submission
  onLogin() {
    if (this.email.invalid || this.password.invalid) {
      this.updateErrorMessage();
      return;
    }
    // Ensure email and password are strings 
    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';
    this.authService.login(emailValue, passwordValue).subscribe(
      (response) => {
        this.authService.setAccessToken(response.accessToken);
        this.route.navigate(['/home'])
      },
      (error) => {
        // Handle login error 
        this.errorMessage = 'Invalid credentials. Please try again.';
      });
  }
}
