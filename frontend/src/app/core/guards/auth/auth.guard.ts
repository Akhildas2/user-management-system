import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  
  const authService = inject(AuthService); // Dependency Injection for AuthService
  const router = inject(Router); // Injecting Router for redirection

  // If the user is logged in, allow access to the route
  if (authService.isLoggedIn()) {
    return true; // Allow the user to proceed to the requested route
  }

  // If not logged in, redirect to the login page
  router.navigate(['/login']);
  return false;
};
