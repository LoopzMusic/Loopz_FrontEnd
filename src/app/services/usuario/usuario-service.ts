import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../shared/models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8085/usuario'; 

  buscarUsuarioPorId(cdCliente: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/buscar/${cdCliente}`);
  }

  atualizarUsuario(cdCliente: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/update/${cdCliente}`, usuario);
  }
}