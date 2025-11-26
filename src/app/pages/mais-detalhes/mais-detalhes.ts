import { Component, ElementRef, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
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

  @ViewChild('toastCarrinho') toastCarrinho!: ElementRef;

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

  showToastCarrinho(msg: string) {
    this.toastCarrinho.nativeElement.querySelector('.toast-body').textContent = msg;

    // @ts-ignore
    const toast = new bootstrap.Toast(this.toastCarrinho.nativeElement);
    toast.show();
  }

  adicionarAoCarrinho(qtdInput: HTMLInputElement) {
  const quantidade = Number(qtdInput.value);

  let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

  const itemExistente = carrinho.find((item: any) => item.cdProduto === this.produto.cdProduto);

  if (itemExistente) {
    itemExistente.quantidade += quantidade;
  } else {
    carrinho.push({
      cdProduto: this.produto.cdProduto,
      nome: this.produto.nmProduto,
      marca: this.produto.dsCategoria ?? 'Não informado',
      preco: this.produto.vlProduto,
      quantidade: quantidade,
      estoque: this.produto.qtdEstoqueProduto,
      imagem: `http://localhost:8085/produto/${this.produto.cdProduto}/imagem`
    });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
    this.showToastCarrinho("Produto adicionado ao carrinho!");
}

aumentarQtd(input: HTMLInputElement) {
  const atual = Number(input.value);
  if (atual < this.produto.qtdEstoqueProduto) {
    input.value = (atual + 1).toString();
  }
}

diminuirQtd(input: HTMLInputElement) {
  const atual = Number(input.value);
  if (atual > 1) {
    input.value = (atual - 1).toString();
  }
}
}
