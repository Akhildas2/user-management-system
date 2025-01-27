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
  isAdmin = false;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUserProfile);
  }

  // Admin Menu Items
  readonly adminMenuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'people', label: 'Users List', route: '/admin/user-list' },
    { icon: 'person', label: 'Profile', route: '/admin/profile' },
    { icon: 'notifications', label: 'Notifications', route: '/admin/notifications' },
    { icon: 'settings', label: 'Settings', route: '/admin/settings' },
  ]);

  // User Menu Items
  readonly userMenuItems = signal<MenuItem[]>([
    { icon: 'home', label: 'Home', route: '/user/home' },
    { icon: 'person', label: 'Profile', route: '/user/profile' },
    { icon: 'history', label: 'My Activity', route: '/user/my-activity' },
    { icon: 'settings', label: 'Settings', route: '/user/settings' },
    { icon: 'help', label: 'Help', route: '/user/help' },

  ]);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.getProfile());
    this.user$.subscribe(user => {
      this.isAdmin = user?.isAdmin || false;
    });
  }

  getProfileImage(): string {
    let profileImage ='assets/icons/profile-user.png'; 
    this.user$.subscribe((user)=>{
      if(user?.profileImage){
        profileImage = user.profileImage;
      }
    });
    return profileImage
  }

}
