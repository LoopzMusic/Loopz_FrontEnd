import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const perfilGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = authService.getUsuarioLogado();
  if (usuario && usuario.userRole == 'ADMIN') {
    return true;
  }
  router.navigate(['/']);
  return false;
};
