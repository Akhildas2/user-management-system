import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../Material.Module';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,CommonModule,MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


}
