import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../Material.Module';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Store } from '@ngrx/store';
import { IUser } from '../../../shared/models/userModel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { selectUserLoading, selectUserProfile } from '../../../store/selectors/user.selectors';
import * as UserActions from '../../../store/actions/user.actions'
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, MatNativeDateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user$: Observable<IUser | null>;
  isLoading$: Observable<boolean>;
  editMode: boolean = false;
  detailsForm: FormGroup;
  personalInfoForm: FormGroup;
  editableUser: Partial<IUser> = {};

  positions: { position: string, icon: string }[] = [
    { position: 'Developer', icon: 'code' },
    { position: 'Designer', icon: 'brush' },
    { position: 'Manager', icon: 'business' },
    { position: 'QA Tester', icon: 'check_circle' }
  ];

  constructor(private store: Store, private fb: FormBuilder) {
    this.user$ = this.store.select(selectUserProfile);
    this.isLoading$ = this.store.select(selectUserLoading);

    // Form group for personal information
    this.personalInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });


    // Form group for additional details
    this.detailsForm = this.fb.group({
      dob: ['', [Validators.required]],
      gender: ['Male', [Validators.required]],
      skills: ['', [Validators.required]],
      position: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.getProfile());

    this.user$.subscribe((user) => {
      if (user) {
        this.personalInfoForm.patchValue({
          name: user.name,
          phone: user.phone
        });
        this.editableUser = { ...user };
      }
    })
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  updatePersonalInfo(): void {
    if (this.personalInfoForm.valid) {
      const updatedData = this.personalInfoForm.value;
      console.log('Updated Personal Info:', updatedData);
    }
  }

  addDetails(): void {
    if (this.detailsForm.valid) {
      const formData = this.detailsForm.value;
      console.log('Submitted Form Data:', formData);
    }
  }



}
