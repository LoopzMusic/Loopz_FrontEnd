import { Component, inject, OnInit } from '@angular/core';
import { PedidoService } from '../../services/usuario/pedidos/pedido';
import { PedidoResumo } from '../../shared/models/usuario/PedidosUsuarios';
import { CardMeusPedidos } from '../../components/card-meus-pedidos/card-meus-pedidos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CardMeusPedidos, CommonModule],
  templateUrl: './meus-pedidos.html',
  styleUrls: ['./meus-pedidos.scss'],
})
export class MeusPedidos implements OnInit {
  private pedidoService = inject(PedidoService);

  protected pedidos: PedidoResumo[] = [];
  loading = false;
  erro: string | null = null;

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.loading = true;
    this.erro = null;

    this.pedidoService.listarMeusPedidos().subscribe({
      next: (response) => {
        this.pedidos = response;
        this.loading = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar pedidos.';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
