import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService); // Dependency Injection for AuthService
  const router = inject(Router); // Injecting Router for redirection

  // Check if the user is logged in
  if (authService.isLoggedIn()) {    
    return true; // User is authenticated, allow access
  }

  // If not logged in, redirect to the login page with a return URL
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false; // Deny access to the route
};
