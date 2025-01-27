import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../../../Material.Module';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/actions/auth.actions'
import * as UserActions from '../../../store/actions/user.actions'
import { Observable } from 'rxjs';
import { IUser } from '../../models/userModel';
import { selectUserProfile } from '../../../store/selectors/user.selectors';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

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
  globalSearchQuery = '';

  // Admin Menu Items
  readonly adminMenuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'people', label: 'Users List', route: '/admin/user-list' },
    { icon: 'notifications', label: 'Notifications', route: '/admin/notifications' },
  ]);

  // User Menu Items
  readonly userMenuItems = signal<MenuItem[]>([
    { icon: 'home', label: 'Home', route: '/user/home' },
    { icon: 'person', label: 'Profile', route: '/user/profile' },
    { icon: 'history', label: 'My Activity', route: '/user/my-activity' },
    { icon: 'help', label: 'Help', route: '/user/help' },
  ]);

  constructor(private store: Store, private SearchService: SearchService) {
    this.user$ = this.store.select(selectUserProfile);
  }

  isMobile(): boolean {
    return window.innerWidth < 480;
  }

  toggleSidenav(): void {
    this.sidenavOpen.set(!this.sidenavOpen());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  onSearch(): void {
    this.SearchService.updateSearchQuery(this.globalSearchQuery);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.getProfile());
    this.user$.subscribe(user => {
      this.isAdmin = user?.isAdmin || false;
    });
  }

  getProfileImage(): string {
    let profileImage = 'assets/icons/profile-user.png';
    this.user$.subscribe((user) => {
      if (user?.profileImage) {
        profileImage = user.profileImage;
      }
    });
    return profileImage
  }


}
