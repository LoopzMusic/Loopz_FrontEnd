import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../shared/models/LoginRequest';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8085/auth';
  private usuarioLogado: any = null;

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest, isAdmin: boolean): Observable<any> {
    const url = isAdmin ? `${this.baseUrl}/login` : `${this.baseUrl}/login`;
    
    return this.http.post(url, loginData).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        if (response.cdUsuario) {
          const usuario = {
            cdUsuario: response.cdUsuario,
            dsEmail: response.dsEmail,
            userRole: response.userRole
          };
          this.setUsuario(usuario);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUsuario(usuario: any) {
    this.usuarioLogado = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuarioLogado() {
    if (!this.usuarioLogado) {
      const u = localStorage.getItem('usuario');
      if (u) this.usuarioLogado = JSON.parse(u);
    }
    return this.usuarioLogado;
  }

  logout() {
    this.usuarioLogado = null;
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('favoritos')
  }
}