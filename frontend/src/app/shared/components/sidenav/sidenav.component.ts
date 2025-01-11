import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../../../Material.Module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/actions/auth.actions'
import * as UserActions from '../../../store/actions/user.actions'
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IUser } from '../../models/userModel';
import { selectUserProfile } from '../../../store/selectors/user.selectors';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})

export class SidenavComponent implements OnInit {
  sidenavOpen = signal(false);
  user$: Observable<IUser | null>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUserProfile);
  }

  // Static menuItems
  menuItems = signal<MenuItem[]>([
    { icon: 'home', label: 'Home', route: '/home' },
    { icon: 'person', label: 'Profile', route: '/profile' },
    { icon: 'task', label: 'Task', route: '/task' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
  ]);

  logout(): void {
    this.store.dispatch(AuthActions.logout())
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.getProfile())
  }

  getProfileImageUrl(profileImage: string | undefined | null): string {
    return profileImage ? `${environment.apiUrl}/${profileImage}` : 'assets/icons/profile-user.png';
  }

}
