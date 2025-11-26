import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../shared/models/Usuario';
import { Pedido } from '../shared/models/Pedido';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private http = inject(HttpClient);

  buscarPessoaPorId(id: number) {
    return this.http.get<Usuario>(`http://localhost:8085/usuario/buscar/${id}`);
  }

  buscarMeusPedidos() {
    return this.http.get<Pedido[]>(`http://localhost:8085/pedido/meus`);
  }
}
