import { Component, Input } from '@angular/core';
import { Pedido } from '../../shared/models/Pedido';

@Component({
  selector: 'app-card-meus-pedidos',
  imports: [],
  templateUrl: './card-meus-pedidos.html',
  styleUrl: './card-meus-pedidos.scss',
})
export class CardMeusPedidos {
  @Input() pedido: Pedido = new Pedido();
}
