import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../Material.Module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../models/userModel';
import { CommonModule } from '@angular/common';
import { minimumAgeValidator, noNullOrStringNullValidator } from '../../validators/dob.validator';
import { DateAdapter } from '@angular/material/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { noWhitespaceValidator } from '../../validators/whitespace.validator';
import { optionalFieldsRequiredValidator } from '../../validators/optionalField.validator';
import { conditionalValidator } from '../../validators/conditional.validator';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css',
})
export class UserDialogComponent {
  userForm: FormGroup;
  isEditMode: boolean;
  isViewMode: boolean;
  isAddMode: boolean;
  defaultProfileImage: string = 'assets/icons/profile-user.png';
  previewImage: string | ArrayBuffer | null | undefined = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: IUser | null, mode: string },
    private dialog: MatDialog
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.isEditMode = data.mode === 'edit';
    this.isViewMode = data.mode === 'view';
    this.isAddMode = data.mode === 'add';

    this.previewImage = data.user?.profileImage || this.defaultProfileImage;

    this.userForm = this.fb.group({
      profileImage: [{ value: data.user?.profileImage || this.defaultProfileImage }],
      name: [{ value: data.user?.name || '', disabled: this.isViewMode }, [Validators.required, Validators.minLength(2), Validators.maxLength(20), noWhitespaceValidator]],
      email: [{ value: data.user?.email || '', disabled: this.isViewMode }, [Validators.required, Validators.email, noWhitespaceValidator]],
      phone: [{ value: data.user?.phone || '', disabled: this.isViewMode }, [Validators.required, Validators.pattern(/^\d{10}$/), noWhitespaceValidator, Validators.maxLength(10), Validators.minLength(10)]],
      dob: [{ value: data.user?.dob ? new Date(data.user.dob) : '', disabled: this.isViewMode }, this.isAddMode || this.isEditMode ? [conditionalValidator([minimumAgeValidator(18), noNullOrStringNullValidator])] : []],
      gender: [{ value: data.user?.gender || '', disabled: this.isViewMode }, this.isAddMode || this.isEditMode ? [conditionalValidator([noWhitespaceValidator])] : []],
      position: [{ value: data.user?.position || '', disabled: this.isViewMode }, this.isAddMode || this.isEditMode ? [conditionalValidator([noWhitespaceValidator])] : []],
      skills: [{ value: data.user?.skills || '', disabled: this.isViewMode }, this.isAddMode || this.isEditMode ? [conditionalValidator([Validators.minLength(2), Validators.maxLength(20), noWhitespaceValidator])] : []]
    }, {
      validators: optionalFieldsRequiredValidator(['dob', 'gender', 'position', 'skills'])
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile, this.selectedFile.name);
      }

      Object.keys(this.userForm.controls).forEach(key => {
        if (key === 'profileImage' && this.selectedFile) {
          return;
        }
        const control = this.userForm.get(key);
        let value = control?.value;

        if (value == null) {
          value = '';
        }

        // Handle Date objects by converting to ISO string
        if (value instanceof Date) {
          value = value.toISOString();
        }

        formData.append(key, value);
      });

      if (this.data.user?._id) {
        formData.append('_id', this.data.user._id);
      }

      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      if (this.selectedFile.size > 2 * 1024 * 1024) {
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
      reader.onload = (e) => {
        this.previewImage = e.target?.result;
        this.userForm.patchValue({ profileImage: this.previewImage });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  errorMessage(errors: any): string {
    if (errors.required) return 'This field is required.';
    if (errors.whitespace) return 'Cannot be empty or contain only spaces.';
    if (errors.minlength) return `Must be at least ${errors.minlength.requiredLength} characters.`;
    if (errors.maxlength) return `Cannot exceed ${errors.maxlength.requiredLength} characters.`;
    if (errors.email) return 'Please enter a valid email.';
    if (errors.pattern) return 'Invalid format.';
    if (errors.minAge) return 'You must be at least 18 years old.';
    if (errors.matDatepickerParse) return 'Invalid date format. Please enter a valid date.';
    if (errors.invalidDob) return 'Invalid date of birth.';
    if (errors.incompleteOptionalFields) return 'All optional fields must be filled if any are provided.';
    return 'Invalid input.';
  }

}
