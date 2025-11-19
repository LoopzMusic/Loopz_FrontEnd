import { Component, inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardAvaliacao } from '../../components/card-avaliacao/card-avaliacao';
import { ProdutoService } from '../../services/produto-service';
import { Produto } from '../../shared/models/Produto';

@Component({
  selector: 'app-mais-detalhes',
  imports: [RouterLink, CardAvaliacao],
  templateUrl: './mais-detalhes.html',
  styleUrl: './mais-detalhes.scss',
})
export class MaisDetalhes implements OnInit {
  private produtoService = inject(ProdutoService);
  private route = inject(ActivatedRoute);

  produto: Produto = new Produto();
  // avaliacoes: Avaliacao[] = [];

  constructor() {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.produtoService.buscarProdutoPorId(id).subscribe((response) => {
      this.produto = response;
    });

    // this.produtoService.buscarAvaliacoesPorProdutoId(id).subscribe(response => {
    //   this.avaliacoes = response;
    // });
  }
}
