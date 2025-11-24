import { Injectable } from '@angular/core';
import { Usuario } from '../shared/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuario!: Usuario | null;

  login(usuario: Usuario) {
    this.usuario = usuario;
  }

  getUsuarioLogado() {
    return this.usuario;
  }

  logout() {
    this.usuario = null;
  }
}
