import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho/carrinho.service';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, RouterModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho implements OnInit, OnDestroy {
  private carrinhoService = inject(CarrinhoService);
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
    console.log('🛒 Carregando carrinho...');

    // ✅ Verifica usuário diretamente do localStorage
    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

    console.log('👤 Usuário:', usuario);

    if (!usuario || !usuario.cdUsuario) {
      // Se não estiver logado, usa apenas localStorage
      console.log('⚠️ Usuário não logado, usando localStorage');
      this.itensCarrinho = this.carrinhoService.obterCarrinhoLocal();
      console.log('📦 Itens do localStorage:', this.itensCarrinho);
      return;
    }

    this.carregando = true;

    // Carrega do backend se estiver logado
    console.log('🔄 Buscando carrinho do backend...');
    this.carrinhoService.buscarDetalhesCarrinho().subscribe({
      next: (carrinho) => {
        console.log('✅ Resposta do backend:', carrinho);

        if (carrinho && carrinho.itens && carrinho.itens.length > 0) {
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

          console.log('💾 Salvando no localStorage:', this.itensCarrinho);
          localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
        } else {
          // Se backend retornar vazio, tenta usar localStorage
          console.warn('⚠️ Backend retornou vazio, tentando localStorage...');
          const carrinhoLocal = this.carrinhoService.obterCarrinhoLocal();

          if (carrinhoLocal.length > 0) {
            console.log('✅ Encontrado carrinho no localStorage:', carrinhoLocal);
            this.itensCarrinho = carrinhoLocal;
          } else {
            console.log('❌ Carrinho vazio em ambos os lugares');
            this.itensCarrinho = [];
          }
        }
        this.carregando = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar carrinho:', error);
        console.log('🔄 Fallback: usando localStorage');

        // Fallback: usa localStorage
        this.itensCarrinho = this.carrinhoService.obterCarrinhoLocal();
        console.log('📦 Itens do fallback:', this.itensCarrinho);
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
      this.carrinhoService.removerItem(cdProduto);
      this.carregarCarrinho();
    }
  }

  calcularSubtotal(): number {
    return this.itensCarrinho.reduce((total, item) => {
      return total + item.preco * item.quantidade;
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

    // ✅ Verifica usuário diretamente do localStorage
    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

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
