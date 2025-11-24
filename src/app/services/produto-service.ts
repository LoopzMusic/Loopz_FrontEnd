import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Produto } from '../shared/models/Produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);

  listarProdutos() {
    return this.http.get<Produto[]>('http://localhost:8085/produto/listar/todos');
  }

  buscarProdutoPorId(id: number) {
    return this.http.get<Produto>(`http://localhost:8085/produto/${id}/idProduto`);
  }

filtrarPorCategoria(categoria: string) {
    return this.http.get<Produto[]>(
      `http://localhost:8085/produto/categoria/${categoria}`
    );
  }

}
