import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TotalResponseDto {
  total: number;
}

export interface ResumoCompleto {
  totalProdutos: number;
  totalPedidos: number;
  totalFeedbacks: number;
  pedidosEmAndamento?: number; // Novo campo
}

@Injectable({
  providedIn: 'root'
})
export class ResumoAdministrativoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8085/admin/resumo';
  private apiUrlPedidos = 'http://localhost:8085/admin/auditoria/pedidos';

  getTotalProdutos(): Observable<TotalResponseDto> {
    return this.http.get<TotalResponseDto>(`${this.apiUrl}/produtos/total`);
  }

  getTotalPedidos(): Observable<TotalResponseDto> {
    return this.http.get<TotalResponseDto>(`${this.apiUrl}/pedidos/total`);
  }

  getTotalFeedbacks(): Observable<TotalResponseDto> {
    return this.http.get<TotalResponseDto>(`${this.apiUrl}/feedbacks/total`);
  }

 
  getPedidosEmAndamento(): Observable<number> {
    return this.http.get<any[]>(this.apiUrlPedidos).pipe(
      map(pedidos => {
        
        const hoje = new Date();
        const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);  //Pegar o dia de hoje e os pedidos dos últimos 7 dias
        
        return pedidos.filter(pedido => {
          const dataPedido = new Date(pedido.dtFinalizacao);
          return dataPedido >= seteDiasAtras;
        }).length;
      })
    );
  }

  
  getResumoCompleto(): Observable<ResumoCompleto> {
    return forkJoin({
      produtos: this.getTotalProdutos(),
      pedidos: this.getTotalPedidos(),
      feedbacks: this.getTotalFeedbacks(),
      pedidosEmAndamento: this.getPedidosEmAndamento()
    }).pipe(
      map(result => ({
        totalProdutos: result.produtos.total,
        totalPedidos: result.pedidos.total,
        totalFeedbacks: result.feedbacks.total,
        pedidosEmAndamento: result.pedidosEmAndamento
      }))
    );
  }
}