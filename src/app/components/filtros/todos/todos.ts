import { Component, inject } from '@angular/core';
import { Card } from '../../card/card';
import { ProdutoService } from '../../../services/produto-service';
import { Produto } from '../../../shared/models/Produto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos',
  imports: [Card, FormsModule],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos {
  private produtoService = inject(ProdutoService);
  protected produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  ngOnInit(): void {
    this.produtoService.listarProdutos().subscribe((response) => {
      this.produtos = response;
      this.produtosFiltrados = response;
    });

    this.produtoService.filtroPesquisa$.subscribe((texto) => {
      texto = texto.toLowerCase();

      this.produtosFiltrados = this.produtos.filter(
        (p) =>
          p.nmProduto.toLowerCase().includes(texto) || p.dsCategoria.toLowerCase().includes(texto)
      );
    });
  }

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
