import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Produto } from '../shared/models/Produto';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8085/produto';
  private apiUrlRecomendacao = 'http://localhost:8085/recomendacao';

  listarProdutos() {
    return this.http.get<Produto[]>('http://localhost:8085/produto/listar/todos');
  }

  buscarProdutoPorId(id: number) {
    return this.http.get<Produto>(`http://localhost:8085/produto/${id}/detalhes`);
  }

  filtrarPorCategoria(categoria: string) {
    return this.http.get<Produto[]>(`http://localhost:8085/produto/categoria/${categoria}`);
  }

  //cadastro de produto
  cadastrarProduto(data: FormData) {
    return this.http.post<any>('http://localhost:8085/produto/criar', data);
  }

  //cadastrar estoque do produto
  criarEstoque(body: any) {
    return this.http.post<any>('http://localhost:8085/estoque/criar', body);
  }

  
  buscarProdutosRecomendados(cdProduto: number): Observable<Produto[]> {
    return this.http.get<any[]>(`${this.apiUrlRecomendacao}/${cdProduto}/recomendados`).pipe(
      switchMap(recomendados => {
        
        if (!recomendados || recomendados.length === 0) {
          return of([]);
        }

        
        const ids = recomendados.map(r => r.cdProduto);

        
        const requests = ids.map(cdProduto => 
          this.buscarProdutoPorId(cdProduto).pipe(
            catchError(error => {
              console.error(`Erro ao buscar produto ${cdProduto}:`, error);
              return of(null);
            })
          )
        );

        
        return forkJoin(requests).pipe(
          map(produtos => produtos.filter(p => p !== null) as Produto[])
        );
      }),
      catchError(error => {
        console.error('Erro ao buscar produtos recomendados:', error);
        return of([]);
      })
    );
  }
}