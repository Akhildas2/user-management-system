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
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../../../shared/components/user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [HeaderComponent, MaterialModule, CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['profileImage', 'name', 'email', 'phone', 'blockedStatus', 'actions'];
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
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private searchService: SearchService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.fetchUsers();
    // Listen for search query updates
    this.searchService.searchQuery$.subscribe((query) => {
      this.applyGlobalFilter(query);
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
    this.dataSource.sort = this.sort;
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

  openUserDialog(user: IUser | null = null, mode: string): void {
    if (this.dialog.openDialogs.length > 0) {
      return;
    }


    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '1000px',
      data: { user, mode }
    });


    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (mode === 'edit') {
          this.updateUser(result);
        } else if (mode === 'add') {
          this.addUser(result);
        }
      }
    });
  }

  addUser(user: FormData): void {
    this.store.dispatch(AdminActions.addUser({ user }));
  }

  updateUser(user: FormData): void {
    this.store.dispatch(AdminActions.updateUser({ user }));
  }

  deleteUser(user: IUser): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        icon: 'warning',
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${user.name}'s account? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!user._id) {
          console.error('Error: Cannot delete user without ID');
          return;
        }
        this.store.dispatch(AdminActions.deleteUser({ id: user._id }));
      }
    })
  }

}
