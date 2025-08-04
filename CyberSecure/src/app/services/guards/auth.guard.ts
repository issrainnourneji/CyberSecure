import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const userGuard: CanActivateFn = (route, state) => {
  if (inject(TokenService).isAuthenticated()) {
    return true;
  }else{
    inject(Router).navigate(['/home'])
    return false;
  }
};

export const clientGuard: CanActivateFn = (route, state) => {
  if (inject(TokenService).isClient()) {
    return true;
  }else{
    inject(Router).navigate(['/home'])
    return false;
  }
};


export const adminGuard: CanActivateFn = (route, state) => {
  if (inject(TokenService).isAdmin()) {
    return true;
  }else{
    inject(Router).navigate(['/home'])
    return false;
  }
};
