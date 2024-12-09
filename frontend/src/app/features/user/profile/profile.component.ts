import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../Material.Module';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Store } from '@ngrx/store';
import { IUser } from '../../../shared/models/userModel';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, take } from 'rxjs';
import { selectUserLoading, selectUserProfile } from '../../../store/selectors/user.selectors';
import { selectCurrentUserId } from '../../../store/selectors/auth.selectors';
import * as UserActions from '../../../store/actions/user.actions'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, MaterialModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit,OnDestroy {
  user$: Observable<IUser | null>;
  isLoading$: Observable<boolean>;
  currentUserId$: Observable<string | undefined>;
  private destroy$ = new Subject<void>();
  editMode: boolean = false;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUserProfile);
    this.isLoading$ = this.store.select(selectUserLoading);
    this.currentUserId$ = this.store.select(selectCurrentUserId)
  }

  ngOnInit(): void {
    this.currentUserId$.pipe(take(1)).subscribe(id => {
      if (id) {
        this.store.dispatch(UserActions.getProfile({ id }))
      }
    })
    console.log("user", this.currentUserId$);

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
