import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuardGuard implements CanActivate {

  constructor(private authService:AuthService,
    private router:Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      const Islogged =  this.authService.isLoggedIn();

      if(!Islogged){
        this.router.navigate(['/auth/login'])
        return false;
      }

      return true;
  }

}
