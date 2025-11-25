import { Component, inject } from '@angular/core';
import { Produto } from '../../../shared/models/Produto';
import { ProdutoService } from '../../../services/produto-service';
import { Card } from '../../card/card';

@Component({
  selector: 'app-cordas',
  imports: [Card],
  templateUrl: './cordas.html',
  styleUrl: './cordas.scss',
})
export class Cordas {
  private produtoService = inject(ProdutoService);

  ngOnInit(): void {
    this.produtoService.listarProdutos().subscribe((response) => {
      this.produtos = response.filter((p) => p.dsCategoria === 'CORDA');
    });
  }

  protected produtos: Produto[] = [];

  ordenar(event: any) {
    const tipo = event.target.value;

    if (tipo === 'menor') {
      this.produtos.sort((a, b) => a.vlProduto - b.vlProduto);
    }

    if (tipo === 'maior') {
      this.produtos.sort((a, b) => b.vlProduto - a.vlProduto);
    }
  }
}
