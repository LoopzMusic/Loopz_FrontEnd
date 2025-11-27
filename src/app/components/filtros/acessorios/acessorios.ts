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

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  ngOnInit(): void {
    this.produtoService.listarProdutos().subscribe((response) => {
      this.produtos = response.filter((p) => p.dsAcessorio === 'S');
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
