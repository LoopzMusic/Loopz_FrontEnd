import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../shared/models/LoginRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8085/auth'; // ajuste para o endpoint do backend
  private usuarioLogado: any = null;

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest, isAdmin: boolean): Observable<any> {
    const url = isAdmin ? `${this.baseUrl}/login` : `${this.baseUrl}/login`;
    return this.http.post(url, loginData);
  }

  setUsuario(usuario: any) {
    this.usuarioLogado = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario)); // persiste entre reloads
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
  }
}
