import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/selectors/auth.selectors';
import { IUser } from '../../../shared/models/userModel';
import { MaterialModule } from '../../../../Material.Module';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, MaterialModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user$: Observable<IUser | null>;
  private userSubscription!: Subscription;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
  }


  ngOnInit(): void {
    // Subscribe to the user$ observable to log the value when it changes
    this.userSubscription = this.user$.subscribe(user => {
      console.log("user", user);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe when the component is destroyed to avoid memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
