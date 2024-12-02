import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../../Material.Module';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

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
  readonly phone = new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]);
  readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/),
  ]);

  fields = [
    { name: 'name', label: 'Name', icon: 'account_circle', placeholder: 'Your Name', control: this.name, type: 'text', errorMessage: () => this.nameErrorMessage() },
    { name: 'email', label: 'Email Address', icon: 'email', placeholder: 'abc@example.com', control: this.email, type: 'email', errorMessage: () => this.emailErrorMessage() },
    { name: 'phone', label: 'Phone Number', icon: 'phone', placeholder: '123456789', control: this.phone, type: 'text', errorMessage: () => this.phoneErrorMessage() },
    { name: 'password', label: 'Password', icon: 'lock', placeholder: 'Enter password', control: this.password, type: 'password', errorMessage: () => this.passwordErrorMessage() },
  ];

  nameErrorMessage = signal('');
  emailErrorMessage = signal('');
  phoneErrorMessage = signal('');
  passwordErrorMessage = signal('');
  errorMessage = signal('');
  hide = signal(true);

  constructor(private authService:AuthService,private router:Router) {
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
    this.nameErrorMessage.set(
      this.name.hasError('required') ? 'Name is required' :
        this.name.hasError('minlength') ? `Name should be at least ${this.name.errors?.['minlength']?.requiredLength} characters` :
          this.name.hasError('maxlength') ? `Name should not exceed ${this.name.errors?.['maxlength']?.requiredLength} characters` : ''
    );
    
    this.emailErrorMessage.set(
      this.email.hasError('required') ? 'Email is required' :
        this.email.hasError('email') ? 'Please enter a valid email address' : ''
    );
    
    this.phoneErrorMessage.set(
      this.phone.hasError('required') ? 'Phone is required' :
        this.phone.hasError('pattern') ? 'Phone number must be exactly 10 digits' : ''
    );
    
    this.passwordErrorMessage.set(
      this.password.hasError('required') ? 'Password is required' :
        this.password.hasError('minlength') ? `Password should be at least ${this.password.errors?.['minlength']?.requiredLength} characters` :
          this.password.hasError('pattern') ? 'Password should contain at least one letter and one number' : ''
    );
  }

  toggleVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  isFormValid(): boolean {
    return this.name.valid && this.email.valid && this.phone.valid && this.password.valid;
  }

  proceedRegister() {
    const name = String(this.name.value);
    const email = String(this.email.value);
    const phone = Number(this.phone.value);
    const password = String(this.password.value);
    

    this.authService.register(name, email, phone, password).subscribe(
      (response) => {
        this.authService.setAccessToken(response.accessToken );
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage.set('User already exists or there was an error. Please try again.');
      }
    );
  }
}
