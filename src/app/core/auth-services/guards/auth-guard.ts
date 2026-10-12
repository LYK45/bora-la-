import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const plataformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(plataformId)) {
    return true;
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate([`/login`]);
  return false;
};
