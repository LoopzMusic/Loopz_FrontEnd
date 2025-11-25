import { Component, inject } from '@angular/core';
import { Card } from '../../card/card';
import { ProdutoService } from '../../../services/produto-service';
import { Produto } from '../../../shared/models/Produto';

@Component({
  selector: 'app-acessorios',
  imports: [Card],
  templateUrl: './acessorios.html',
  styleUrl: './acessorios.scss',
})
export class Acessorios {
  private produtoService = inject(ProdutoService);

  ngOnInit(): void {
    this.produtoService.listarProdutos().subscribe((response) => {
      this.produtos = response.filter((p) => p.dsAcessorio === 'S');
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
