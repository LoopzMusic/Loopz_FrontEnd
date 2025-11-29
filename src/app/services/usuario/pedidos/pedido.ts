
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoResumo, PedidoResumoAdminTodos } from '../../../shared/models/usuario/PedidosUsuarios';
import { AuthService } from '../../auth-service';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:8085/pedido';
  private apiUrlAdmin = 'http://localhost:8085/admin/auditoria/pedidos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  listarMeusPedidos(): Observable<PedidoResumo[]> {
    const token = this.authService.getToken();
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    return this.http.get<PedidoResumo[]>(`${this.apiUrl}/meus`, { headers });
  }

  listarTodosPedidosAdmin(): Observable<PedidoResumoAdminTodos[]> {
    return this.http.get<PedidoResumoAdminTodos[]>(this.apiUrlAdmin);
  }

  atualizarStatusPedido(cdPedido: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/atualizar/${cdPedido}/status`, { status });
  }
  
}
