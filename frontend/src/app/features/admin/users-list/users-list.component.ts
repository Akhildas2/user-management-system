import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MaterialModule } from '../../../../Material.Module';
import { CommonModule } from '@angular/common';
import { IUser } from '../../../shared/models/userModel';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AdminActions from '../../../store/actions/admin.actions';
import { selectAdminError, selectAdminLoading, selectAllUsers } from '../../../store/selectors/admin.selectors';
import { SearchService } from '../../../shared/services/search.service';
import { MatPaginator } from '@angular/material/paginator';

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
  filterValue: string = '';
  profileImage = 'assets/icons/profile-user.png';
  length = 0; // Total number of items
  pageSize = 5; // Number of items per page
  pageIndex = 0; // Current page index
  pageSizeOptions = [5, 10, 20]; // Options for page size
  showFirstLastButtons = true; // Whether to show First/Last buttons on paginator

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: Store, private searchService: SearchService) { }
  ngOnInit(): void {
    this.fetchUsers();

    // Listen for search query updates
    this.searchService.searchQuery$.subscribe((query) => {
      this.applyGlobalFilter(query);
      console.log(query);

    })

    // Bind loading and error state selectors to observables
    this.isLoading$ = this.store.select(selectAdminLoading);
    this.error$ = this.store.select(selectAdminError);

    // Custom filter
    this.dataSource.filterPredicate = (data: IUser, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return (
        data.name.toLowerCase().includes(filterText) ||
        data.email.toLowerCase().includes(filterText) ||
        data.phone.toString().includes(filterText)
      );
    };

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchUsers(): void {
    this.store.dispatch(AdminActions.fetchUsers());

    this.store.select(selectAllUsers).subscribe((users) => {
      this.dataSource.data = users;
      this.length = users.length;
    })
  }

  applyGlobalFilter(filter: string): void {
    this.filterValue = filter;
    this.dataSource.filter = filter.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
  addUser(user: IUser): void {
    console.log('Edit user:', user);
    // Implement user editing logic here
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
