import { Component, signal } from '@angular/core';
import { MaterialModule } from '../../../../Material.Module';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, SidenavComponent, RouterModule, CommonModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  sidenavOpen = signal(false);

  menuItems = signal<MenuItem[]>([
    { icon: 'home', label: 'Home', route: '/home' },
    { icon: 'person', label: 'Profile', route: '/profile' },
    { icon: 'task', label: 'Task', route: '/task' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
  ]);

  isMobile(): boolean {
    return window.innerWidth < 480;
  }

  toggleSidenav(): void {
    this.sidenavOpen.set(!this.sidenavOpen());
  }

}
