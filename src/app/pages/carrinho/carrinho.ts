import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface ItemCarrinho {
  cdProduto: number;
  id: number;
  nome: string;
  marca: string;
  preco: number;
  quantidade: number;
  estoque: number;
  imagem: string;
}

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, RouterModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho {
  itensCarrinho: ItemCarrinho[] = [];
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.carregarCarrinho();
  }

  aumentarQuantidade(item: any) {
    if (item.quantidade < item.estoque) {
      item.quantidade++;
      this.salvarCarrinho();
    }
  }

  diminuirQuantidade(item: any) {
    if (item.quantidade > 1) {
      item.quantidade--;
      this.salvarCarrinho();
    }
  }

  removerItem(cdProduto: number) {
  this.itensCarrinho = this.itensCarrinho.filter(item => item.cdProduto !== cdProduto);
  this.salvarCarrinho();
}

  calcularSubtotal(): number {
    return this.itensCarrinho.reduce((total, item) => {
      return total + (item.preco * item.quantidade);
    }, 0);
  }

  calcularTotal(): number {
    return this.calcularSubtotal();
  }

  finalizarCompra(): void {
    if (this.itensCarrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    console.log('Finalizando compra...', {
      itens: this.itensCarrinho,
      total: this.calcularTotal()
    });

    // Aqui você deve chamar seu serviço para criar o pedido
    // this.pedidoService.criar(this.itensCarrinho).subscribe({
    //   next: (response) => {
    //     this.router.navigate(['/checkout']);
    //   },
    //   error: (error) => {
    //     console.error('Erro ao finalizar compra:', error);
    //     alert('Erro ao finalizar a compra. Tente novamente.');
    //   }
    // });

    // Por enquanto, apenas navega para checkout
    this.router.navigate(['/checkout']);
  }

  salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
  }

  private carregarCarrinho(): void {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.itensCarrinho = JSON.parse(carrinhoSalvo);
    }
  }
}
