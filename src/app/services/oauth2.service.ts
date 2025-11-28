import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

declare var google: any;

export interface GoogleOAuthResponse {
  credential: string;
}

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google ID
}

@Injectable({
  providedIn: 'root',
})
export class OAuth2Service {
  private baseUrl = 'http://localhost:8085/auth';
  private http = inject(HttpClient);
  private googleUserInfo$ = new BehaviorSubject<GoogleUserInfo | null>(null);

  // Seu Google Client ID - substitua pelo seu ID real
  private googleClientId = 'SEU_GOOGLE_CLIENT_ID_AQUI';

  /**
   * Inicializa o Google Sign-In
   */
  initializeGoogleSignIn(
    clientId: string,
    onSuccess: (response: any) => void,
    onError: () => void
  ) {
    this.googleClientId = clientId;

    if (google && google.accounts) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: GoogleOAuthResponse) => {
          this.handleGoogleSignInSuccess(response, onSuccess);
        },
        error_callback: onError,
      });
    }
  }

  /**
   * Renderiza o botão do Google Sign-In
   */
  renderGoogleButton(elementId: string) {
    if (google && google.accounts) {
      google.accounts.id.renderButton(document.getElementById(elementId), {
        type: 'standard',
        size: 'large',
        text: 'signin_with',
        locale: 'pt-BR',
        theme: 'outline',
      });
    }
  }

  /**
   * Decodifica o JWT token do Google e extrai as informações do usuário
   */
  private decodeGoogleToken(token: string): GoogleUserInfo {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  /**
   * Manipula o sucesso do login do Google
   */
  private handleGoogleSignInSuccess(
    response: GoogleOAuthResponse,
    onSuccess: (response: any) => void
  ) {
    const userInfo = this.decodeGoogleToken(response.credential);
    this.googleUserInfo$.next(userInfo);

    // Envia o token para o backend para validação e criação/atualização do usuário
    this.validateGoogleToken(response.credential).subscribe({
      next: (backendResponse) => {
        onSuccess(backendResponse);
      },
      error: (error) => {
        console.error('Erro ao validar token no backend:', error);
      },
    });
  }

  /**
   * Valida o token do Google no backend
   */
  validateGoogleToken(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/google/validate`, { token }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.cdUsuario) {
          const usuario = {
            cdUsuario: response.cdUsuario,
            dsEmail: response.dsEmail,
            nmCliente: response.nmCliente,
            userRole: response.userRole,
            googleId: response.googleId,
            profileComplete: response.profileComplete || false,
          };
          localStorage.setItem('usuario', JSON.stringify(usuario));
        }
      })
    );
  }

  /**
   * Obtém as informações do usuário do Google
   */
  getGoogleUserInfo(): GoogleUserInfo | null {
    return this.googleUserInfo$.value;
  }

  /**
   * Obtém o Observable das informações do usuário do Google
   */
  getGoogleUserInfo$(): Observable<GoogleUserInfo | null> {
    return this.googleUserInfo$.asObservable();
  }

  /**
   * Faz logout do Google
   */
  logoutGoogle() {
    if (google && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
    this.googleUserInfo$.next(null);
  }
}
