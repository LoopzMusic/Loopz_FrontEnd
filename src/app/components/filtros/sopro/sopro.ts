import { Component, inject } from '@angular/core';
import { ProdutoService } from '../../../services/produto-service';
import { Produto } from '../../../shared/models/Produto';
import { Card } from '../../card/card';

@Component({
  selector: 'app-sopro',
  imports: [Card],
  templateUrl: './sopro.html',
  styleUrl: './sopro.scss',
})
export class Sopro {
  private produtoService = inject(ProdutoService);

  ngOnInit(): void {
    this.produtoService.listarProdutos().subscribe((response) => {
      this.produtos = response.filter((p) => p.dsCategoria === 'SOPRO');
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
