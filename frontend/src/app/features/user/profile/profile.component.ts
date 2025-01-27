import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../Material.Module';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Store } from '@ngrx/store';
import { IUser } from '../../../shared/models/userModel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { selectUserError, selectUserLoading, selectUserProfile } from '../../../store/selectors/user.selectors';
import * as UserActions from '../../../store/actions/user.actions'
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { minimumAgeValidator } from '../../../shared/validators/dob.validators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, MatNativeDateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  user$: Observable<IUser | null>;
  isLoading$: Observable<boolean>;
  isLoading: boolean = true;
  error$: Observable<string | null>;
  editMode: boolean = false;
  editAdditionalDetails: boolean = false;
  detailsForm: FormGroup;
  personalInfoForm: FormGroup;
  editableUser: Partial<IUser> = {};
  additionalDetailsAvailable = false;
  previewImage: string | ArrayBuffer | null | undefined = null;
  selectedFile: File | null = null;
  private destroy$ = new Subject<void>();

  positions: { position: string, icon: string }[] = [
    { position: 'Developer', icon: 'code' },
    { position: 'Designer', icon: 'brush' },
    { position: 'Manager', icon: 'business' },
    { position: 'QA Tester', icon: 'check_circle' }
  ];

  constructor(private store: Store, private fb: FormBuilder, private router: Router, private dialog: MatDialog,) {
    this.user$ = this.store.select(selectUserProfile);
    this.isLoading$ = this.store.select(selectUserLoading);
    this.error$ = this.store.select(selectUserError);

    // Form group for personal information
    this.personalInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });

    // Form group for additional details
    this.detailsForm = this.fb.group({
      dob: ['', [Validators.required, minimumAgeValidator(18)]],
      gender: ['Male', [Validators.required]],
      skills: ['', [Validators.required]],
      position: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.getProfile());
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);

    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.personalInfoForm.patchValue({ name: user.name, phone: user.phone });
        this.detailsForm.patchValue({ dob: user.dob, gender: user.gender || 'Male', skills: user.skills, position: user.position });
        this.editableUser = { ...user };
        this.additionalDetailsAvailable = !!user.dob;
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) this.personalInfoForm.patchValue(this.editableUser);
  }

  toggleEditAdditionalDetails(): void {
    this.editAdditionalDetails = !this.editAdditionalDetails;
    if (!this.editAdditionalDetails) this.detailsForm.patchValue(this.editableUser);
  }

  updateUserDetails(form: FormGroup, action: any): void {
    if (form.valid) {
      const updatedData = { ...this.editableUser, ...form.value };
      this.store.dispatch(action({ user: updatedData }));
      this.user$.pipe(take(1), takeUntil(this.destroy$)).subscribe(currentUser => {
        if (currentUser) {
          this.editableUser = currentUser;
          this.editMode = false;
          if (action === UserActions.editProfile) {
            this.additionalDetailsAvailable = true;
            this.editAdditionalDetails = false;
          }
        }
      });
    }
  }

  updatePersonalInfo(): void {
    this.updateUserDetails(this.personalInfoForm, UserActions.editProfile);
  }

  addDetails(): void {
    this.updateUserDetails(this.detailsForm, UserActions.editProfile);
  }


  deleteAccount(): void {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user?._id) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            icon: 'warning',
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete your account? This action cannot be undone.'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.store.dispatch(UserActions.deleteProfile({ id: user._id! }));
            this.router.navigate(['/login']);
          }
        })
      }
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      if (this.selectedFile.size > 1 * 1024 * 1024) {
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            icon: 'warning',
            title: 'File Too Large',
            message: 'The selected file exceeds the maximum allowed size of 2 MB.'
          }
        });
        this.selectedFile = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => this.previewImage = e.target?.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadPhoto(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', this.selectedFile);
      this.user$.pipe(take(1)).subscribe(user => {
        if (user?._id) {
          formData.append('id', user._id);
          this.store.dispatch(UserActions.updateProfileImage({ formData }));
          this.previewImage = null;
          this.selectedFile = null;
        }
      })
    }
  }

  getProfileImage(): string {
    let profileImage = 'assets/icons/profile-user.png';
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user?.profileImage) {
        profileImage = user.profileImage;
      }
    });
    return profileImage;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
