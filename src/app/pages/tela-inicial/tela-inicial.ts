import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../components/card/card';
import { ProdutoService } from '../../services/produto-service';
import { Produto } from '../../shared/models/Produto';

@Component({
  selector: 'app-tela-inicial',
  imports: [RouterLink, Card],
  templateUrl: './tela-inicial.html',
  styleUrl: './tela-inicial.scss',
})
export class TelaInicial implements OnInit {
  private produtoService = inject(ProdutoService);

  ngOnInit(): void {
    this.produtoService.listarProdutos().subscribe((response) => (this.produtos = response));
  }
  protected produtos: Produto[] = [];
}
