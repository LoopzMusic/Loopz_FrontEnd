// favoritos.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8085/favoritos';

  adicionarFavorito(cdProduto: number, cdUsuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/favoritar`, { 
      cdProduto, 
      cdUsuario 
    });
  }

  removerFavorito(cdUsuario: number, cdProduto: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/desfavoritar/${cdUsuario}/${cdProduto}`);
  }

  listarCdProdutosFavoritados(cdUsuario: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/usuario/${cdUsuario}`);
  }
}