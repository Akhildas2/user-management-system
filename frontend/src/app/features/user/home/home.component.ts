import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../Material.Module';
import { RouterLink } from '@angular/router';

export interface Card {
  icon: string,
  title: string;
  content: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MaterialModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  cards: Card[] = [
    { icon: 'task', title: 'Tasks', content: 'Manage your tasks here.', route: '/task' },
    { icon: 'person', title: 'Profile', content: 'View and update your profile.', route: '/profile' },
    { icon: 'settings', title: 'Settings', content: 'Adjust your preferences here.', route: '/settings' }
  ];

}
