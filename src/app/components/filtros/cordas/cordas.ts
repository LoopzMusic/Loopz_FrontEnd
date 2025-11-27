import { Component, inject, OnInit } from '@angular/core';
import { Produto } from '../../../shared/models/Produto';
import { ProdutoService } from '../../../services/produto-service';
import { Card } from '../../card/card';

@Component({
  selector: 'app-cordas',
  imports: [Card],
  templateUrl: './cordas.html',
  styleUrl: './cordas.scss',
})
export class Cordas implements OnInit {
  private produtoService = inject(ProdutoService);

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  ngOnInit(): void {
    this.produtoService.listarProdutos().subscribe((todos) => {
      this.produtos = todos.filter((p) => p.dsCategoria === 'CORDA');
      this.produtosFiltrados = [...this.produtos];
    });

    this.produtoService.filtroPesquisa$.subscribe((texto) => {
      texto = texto.toLowerCase();

      this.produtosFiltrados = this.produtos.filter((p) =>
        p.nmProduto.toLowerCase().includes(texto)
      );
    });
  }

  ordenar(event: any) {
    const tipo = event.target.value;

    if (tipo === 'menor') {
      this.produtosFiltrados.sort((a, b) => a.vlProduto - b.vlProduto);
    }

    if (tipo === 'maior') {
      this.produtosFiltrados.sort((a, b) => b.vlProduto - a.vlProduto);
    }
  }
}
