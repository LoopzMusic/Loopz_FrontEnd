import { Component, Input } from '@angular/core';
import { Pedido } from '../../shared/models/Pedido';
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


}
