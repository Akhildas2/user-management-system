import { Component, computed, signal } from '@angular/core';
import { MaterialModule } from '../../../../Material.Module';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule,SidenavComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 collapsed = signal(false);
 sidenavWidth = computed(()=> this.collapsed() ? '65px' : '250px' )
}
