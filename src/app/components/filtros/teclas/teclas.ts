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

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  ngOnInit(): void {
    this.produtoService.listarProdutos().subscribe((todos) => {
      this.produtos = todos.filter((p) => p.dsCategoria === 'TECLADO');
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
