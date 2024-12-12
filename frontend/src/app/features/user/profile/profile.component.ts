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
  selectedGender: string = 'Male';

  positions: { position: string, icon: string }[] = [
    { position: 'Developer', icon: 'code' },
    { position: 'Designer', icon: 'brush' },
    { position: 'Manager', icon: 'business' },
    { position: 'QA Tester', icon: 'check_circle' }
  ];

  constructor(private store: Store, private fb: FormBuilder) {
    this.user$ = this.store.select(selectUserProfile);
    this.isLoading$ = this.store.select(selectUserLoading);


    this.detailsForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['Male', [Validators.required]],
      skills: ['', [Validators.required]],
      position: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.getProfile());
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  addDeatils(): void {
    if (this.detailsForm.valid) {
      const formData = this.detailsForm.value;
      console.log('Submitted Form Data:', formData);
    }
  }


}
