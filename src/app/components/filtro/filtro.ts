import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../../shared/models/Produto';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto-service';
import { Card } from "../card/card";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule, Card, RouterModule],
  templateUrl: './filtro.html'
})
export class Filtro implements OnInit {

  categoria = '';
  produtos: Produto[] = [];

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {

    // pega categoria da URL
    this.categoria = this.route.snapshot.paramMap.get('categoria') ?? '';

    if (!this.categoria) {
      console.warn('Categoria não veio na URL');
      return;
    }

    this.produtoService.filtrarPorCategoria(this.categoria).subscribe({
      next: (produtos) => {
        console.log('Produtos filtrados:', produtos);
        this.produtos = produtos;
      },
      error: (erro) => console.error('Erro ao filtrar:', erro)
    });
  }
}
