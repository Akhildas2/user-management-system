import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../Material.Module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../models/userModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent {
  userForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: IUser | null }
  ) {
    this.isEditMode = !!data.user;
    this.userForm = this.fb.group({
      name: [data.user?.name || '', Validators.required],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      phone: [data.user?.phone || '', Validators.required],
      isAdmin: [data.user?.isAdmin || false]
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
