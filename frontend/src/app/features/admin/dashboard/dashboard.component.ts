import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MaterialModule } from '../../../../Material.Module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent,MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
