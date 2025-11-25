import { Component, inject } from '@angular/core';
import { ProdutoService } from '../../../services/produto-service';
import { Produto } from '../../../shared/models/Produto';
import { Card } from '../../card/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teclas',
  imports: [Card, FormsModule],
  templateUrl: './teclas.html',
  styleUrl: './teclas.scss',
})
export class Teclas {
  private produtoService = inject(ProdutoService);

  ngOnInit(): void {
    this.produtoService.listarProdutos().subscribe((response) => {
      this.produtos = response.filter((p) => p.dsCategoria === 'TECLADO');
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
