import { Component, signal } from '@angular/core';
import { MaterialModule } from '../../../../Material.Module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class SidenavComponent {
  sidenavOpen = signal(false);

  // Static menuItems
  menuItems = signal<MenuItem[]>([
    { icon: 'home', label: 'Home', route: '/home' },
    { icon: 'person', label: 'Profile', route: '/profile' },
    { icon: 'task', label: 'Task', route: '/task' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
  ]);
}
