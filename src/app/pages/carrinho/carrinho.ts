import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho/carrinho.service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, RouterModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho implements OnInit, OnDestroy {
  private carrinhoService = inject(CarrinhoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  itensCarrinho: ItemCarrinho[] = [];
  carregando = false;
  private subscription?: Subscription;

  ngOnInit(): void {
    this.carregarCarrinho();

    // Observa mudanças no carrinho
    this.subscription = this.carrinhoService.carrinhoObservable$.subscribe(() => {
      this.carregarCarrinho();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  carregarCarrinho(): void {
    const usuario = this.authService.getUsuarioLogado();

    if (!usuario) {
      // Se não estiver logado, usa apenas localStorage
      this.itensCarrinho = this.carrinhoService.obterCarrinhoLocal();
      return;
    }

    this.carregando = true;

    // Carrega do backend se estiver logado
    this.carrinhoService.buscarDetalhesCarrinho().subscribe({
      next: (carrinho) => {
        if (carrinho && carrinho.itens) {
          this.itensCarrinho = carrinho.itens.map((item) => ({
            cdItemCarrinho: item.cdItemCarrinho,
            cdProduto: item.cdProduto,
            nome: item.nomeProduto,
            marca: 'Não informado',
            preco: item.precoUnitario,
            quantidade: item.quantidade,
            estoque: 999,
            imagem: `http://localhost:8085/produto/${item.cdProduto}/imagem`,
          }));

          // Atualiza localStorage
          localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
        } else {
          // Se não houver carrinho no backend, usa localStorage
          this.itensCarrinho = this.carrinhoService.obterCarrinhoLocal();
        }
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar carrinho:', error);
        // Fallback: usa localStorage
        this.itensCarrinho = this.carrinhoService.obterCarrinhoLocal();
        this.carregando = false;
      },
    });
  }

  aumentarQuantidade(item: ItemCarrinho): void {
    if (item.quantidade >= item.estoque) {
      alert('Quantidade máxima em estoque atingida!');
      return;
    }

    if (item.cdItemCarrinho) {
      // Atualiza no backend
      this.carrinhoService.atualizarQuantidade(item.cdItemCarrinho, item.quantidade + 1).subscribe({
        next: () => {
          item.quantidade++;
          this.salvarCarrinhoLocal();
        },
        error: (err) => {
          console.error('Erro ao atualizar quantidade:', err);
          // Fallback: atualiza apenas localmente
          item.quantidade++;
          this.salvarCarrinhoLocal();
        },
      });
    } else {
      // Apenas localStorage
      item.quantidade++;
      this.salvarCarrinhoLocal();
    }
  }

  diminuirQuantidade(item: ItemCarrinho): void {
    if (item.quantidade <= 1) {
      return;
    }

    if (item.cdItemCarrinho) {
      // Atualiza no backend
      this.carrinhoService.atualizarQuantidade(item.cdItemCarrinho, item.quantidade - 1).subscribe({
        next: () => {
          item.quantidade--;
          this.salvarCarrinhoLocal();
        },
        error: (err) => {
          console.error('Erro ao atualizar quantidade:', err);
          // Fallback: atualiza apenas localmente
          item.quantidade--;
          this.salvarCarrinhoLocal();
        },
      });
    } else {
      // Apenas localStorage
      item.quantidade--;
      this.salvarCarrinhoLocal();
    }
  }

  removerItem(cdProduto: number): void {
    const item = this.itensCarrinho.find((i) => i.cdProduto === cdProduto);

    if (!item) return;

    if (confirm('Deseja realmente remover este item do carrinho?')) {
      if (item.cdItemCarrinho) {
        // Remove do backend (usando quantidade 0 ou implementar endpoint DELETE)
        // Por enquanto, apenas remove localmente
        this.carrinhoService.removerItem(cdProduto);
        this.carregarCarrinho();
      } else {
        this.carrinhoService.removerItem(cdProduto);
        this.carregarCarrinho();
      }
    }
  }

  calcularSubtotal(): number {
    return this.itensCarrinho.reduce((total, item) => {
      return total + item.preco * item.quantidade;
    }, 0);
  }

  calcularTotal(): number {
    return this.calcularSubtotal(); // Adicione frete se necessário
  }

  finalizarCompra(): void {
    if (this.itensCarrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const usuario = this.authService.getUsuarioLogado();

    if (!usuario) {
      alert('Você precisa estar logado para finalizar a compra!');
      this.router.navigate(['/login']);
      return;
    }

    // Salva carrinho antes de navegar
    this.salvarCarrinhoLocal();

    // Navega para finalização
    this.router.navigate(['/finalizar-compra']);
  }

  private salvarCarrinhoLocal(): void {
    localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
  }
}
