import { Component, inject, OnInit } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { Pedido } from '../../shared/models/Pedido';
import { CardMeusPedidos } from '../../components/card-meus-pedidos/card-meus-pedidos';

@Component({
  selector: 'app-meus-pedidos',
  imports: [CardMeusPedidos],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.scss',
})
export class MeusPedidos implements OnInit {
  private pessoaService = inject(PessoaService);

  ngOnInit(): void {
    this.pessoaService.buscarMeusPedidos().subscribe((response) => (this.pedidos = response));
  }
  protected pedidos: Pedido[] = [];
}
