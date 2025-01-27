import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MaterialModule } from '../../../../Material.Module';
import { CommonModule } from '@angular/common';
import { IUser } from '../../../shared/models/userModel';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AdminActions from '../../../store/actions/admin.actions';
import { selectAdminError, selectAdminLoading, selectAllUsers } from '../../../store/selectors/admin.selectors';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [HeaderComponent, MaterialModule, CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['profileImage', 'name', 'email', 'phone', 'isAdmin', 'actions'];
  dataSource = new MatTableDataSource<IUser>([]);
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(private store: Store) { }
  ngOnInit(): void {
    // Dispatch the action to fetch users
    this.store.dispatch(AdminActions.fetchUsers());

    // Subscribe to user list and bind it to the table data source
    this.store.select(selectAllUsers).subscribe((users) => {
      this.dataSource.data = users;
      console.log("users", users);

    });

    // Bind loading and error state selectors to observables
    this.isLoading$ = this.store.select(selectAdminLoading);
    this.error$ = this.store.select(selectAdminError);
  }



  editUser(user: IUser): void {
    console.log('Edit user:', user);
    // Implement user editing logic here
  }

  deleteUser(user: IUser): void {
    console.log('Delete user:', user);
    // Dispatch the action to delete the user
  }

}
