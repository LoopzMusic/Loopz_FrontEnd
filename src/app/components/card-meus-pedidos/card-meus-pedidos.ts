import { Component, Input } from '@angular/core';
import { PedidoResumo } from '../../shared/models/usuario/PedidosUsuarios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-meus-pedidos',
  imports: [CommonModule],
  templateUrl: './card-meus-pedidos.html',
  styleUrl: './card-meus-pedidos.scss',
})
export class CardMeusPedidos {
  @Input() pedido!: PedidoResumo;

  getStatusTexto(status: string): string {
    switch (status) {
      case 'ANDAMENTO':
        return 'Aguardando envio';
      case 'FINALIZADO':
        return 'Enviado para entrega';
      default:
        return status;
    }
  }
}
