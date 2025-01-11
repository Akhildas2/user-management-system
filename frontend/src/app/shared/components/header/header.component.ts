import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../../../Material.Module';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/actions/auth.actions'
import * as UserActions from '../../../store/actions/user.actions'
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IUser } from '../../models/userModel';
import { selectUserProfile } from '../../../store/selectors/user.selectors';
import { FormsModule } from '@angular/forms';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, SidenavComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  sidenavOpen = signal(false);
  user$: Observable<IUser | null>;
  isAdmin = false;
  searchQuery = '';
  menuOpen = false;
  
  // Admin Menu Items
  readonly adminMenuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'people', label: 'User List', route: '/user-management' },
    { icon: 'notifications', label: 'Notifications', route: '/notifications' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
  ]);

  // User Menu Items
  readonly userMenuItems = signal<MenuItem[]>([
    { icon: 'home', label: 'Home', route: '/home' },
    { icon: 'person', label: 'Profile', route: '/profile' },
    { icon: 'history', label: 'My Activity', route: '/my-activity' },
    { icon: 'help', label: 'Help', route: '/help' },
  ]);

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUserProfile);
  }

  isMobile(): boolean {
    return window.innerWidth < 480;
  }

  toggleSidenav(): void {
    this.sidenavOpen.set(!this.sidenavOpen());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout())
  }

  onSearch(): void {
    console.log('Search query:', this.searchQuery);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.getProfile());
    this.user$.subscribe(user => {
      this.isAdmin = user?.isAdmin || false;
    });
  }

  getProfileImageUrl(profileImage: string | undefined | null): string {
    return profileImage ? `${environment.apiUrl}/${profileImage}` : 'assets/icons/profile-user.png';
  }

}
