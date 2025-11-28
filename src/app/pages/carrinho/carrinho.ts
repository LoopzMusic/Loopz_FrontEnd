import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho/carrinho.service';
import { ShowToast } from '../../components/show-toast/show-toast';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule, ShowToast],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho implements OnInit, OnDestroy {
  private carrinhoService = inject(CarrinhoService);
  private router = inject(Router);

  itensCarrinho: ItemCarrinho[] = [];
  carregando = false;
  private subscription?: Subscription;
  private atualizandoQuantidade = false; 

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.carregarCarrinho();

    
    this.subscription = this.carrinhoService.carrinhoObservable$.subscribe(() => {
      if (!this.atualizandoQuantidade) {
        this.carregarCarrinho();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  carregarCarrinho(): void {
    console.log('🛒 Carregando carrinho...');

    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

    console.log('👤 Usuário:', usuario);

    if (!usuario || !usuario.cdUsuario) {
      console.log('⚠️ Usuário não logado, usando localStorage');
      this.itensCarrinho = this.carrinhoService.obterCarrinhoLocal();
      console.log('📦 Itens do localStorage:', this.itensCarrinho);
      return;
    }

    this.carregando = true;

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

          localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
        } else {
          console.warn('⚠️ Backend retornou vazio, tentando localStorage...');
          const carrinhoLocal = this.carrinhoService.obterCarrinhoLocal();

          this.itensCarrinho = carrinhoLocal.length > 0 ? carrinhoLocal : [];
        }
        this.carregando = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar carrinho:', error);

        this.itensCarrinho = this.carrinhoService.obterCarrinhoLocal();
        this.carregando = false;
      },
    });
  }

  aumentarQuantidade(item: ItemCarrinho): void {
    if (item.quantidade >= item.estoque) {
      this.mostrarToast('Quantidade máxima em estoque alcançada!', 'error');
      return;
    }

    
    this.atualizandoQuantidade = true;

    
    const quantidadeAnterior = item.quantidade;
    item.quantidade++;
    this.salvarCarrinhoLocal();

    if (item.cdItemCarrinho) {
      this.carrinhoService.atualizarQuantidade(item.cdItemCarrinho, item.quantidade).subscribe({
        next: () => {
          console.log('✅ Quantidade atualizada no backend');
          this.mostrarToast('Quantidade aumentada!');
          
          setTimeout(() => {
            this.atualizandoQuantidade = false;
          }, 300);
        },
        error: (err) => {
          console.error('❌ Erro ao atualizar quantidade:', err);
          
          item.quantidade = quantidadeAnterior;
          this.salvarCarrinhoLocal();
          this.mostrarToast('Erro ao atualizar quantidade', 'error');
          
          this.atualizandoQuantidade = false;
        },
      });
    } else {
      this.mostrarToast('Quantidade aumentada!');
      
      setTimeout(() => {
        this.atualizandoQuantidade = false;
      }, 300);
    }
  }

  diminuirQuantidade(item: ItemCarrinho): void {
    if (item.quantidade <= 1) {
      return;
    }

    
    this.atualizandoQuantidade = true;

   
    const quantidadeAnterior = item.quantidade;
    item.quantidade--;
    this.salvarCarrinhoLocal();

    if (item.cdItemCarrinho) {
      this.carrinhoService.atualizarQuantidade(item.cdItemCarrinho, item.quantidade).subscribe({
        next: () => {
          console.log('✅ Quantidade atualizada no backend');
          this.mostrarToast('Quantidade reduzida!');
          
          setTimeout(() => {
            this.atualizandoQuantidade = false;
          }, 300);
        },
        error: (err) => {
          console.error('❌ Erro ao atualizar quantidade:', err);
          
          item.quantidade = quantidadeAnterior;
          this.salvarCarrinhoLocal();
          this.mostrarToast('Erro ao atualizar quantidade', 'error');
          
          this.atualizandoQuantidade = false;
        },
      });
    } else {
      this.mostrarToast('Quantidade reduzida!');
      
      setTimeout(() => {
        this.atualizandoQuantidade = false;
      }, 300);
    }
  }

  removerItem(cdProduto: number): void {
  const item = this.itensCarrinho.find((i) => i.cdProduto === cdProduto);

  if (!item) return;

  if (confirm('Deseja remover este item do carrinho?')) {
    const index = this.itensCarrinho.findIndex((i) => i.cdProduto === cdProduto);
    
    if (index > -1) {
      
      const itemRemovido = { ...this.itensCarrinho[index] };
      
      
      this.itensCarrinho.splice(index, 1);
      this.salvarCarrinhoLocal();
      
      
      const usuarioStr = localStorage.getItem('usuario');
      const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

      if (usuario && usuario.cdUsuario && item.cdItemCarrinho) {
        
        this.carrinhoService.buscarDetalhesCarrinho().subscribe({
          next: (carrinho) => {
            if (carrinho && carrinho.cdCarrinho) {
              
              this.carrinhoService.removerItemDoCarrinho(carrinho.cdCarrinho, item.cdItemCarrinho!).subscribe({
                next: () => {
                  console.log('✅ Item removido no backend com sucesso');
                  this.mostrarToast('Item removido do carrinho!', 'success');
                },
                error: (err) => {
                  console.error('❌ Erro ao remover item no backend:', err);
                  
                  this.itensCarrinho.splice(index, 0, itemRemovido);
                  this.salvarCarrinhoLocal();
                  this.mostrarToast('Erro ao remover item. Tente novamente.', 'error');
                }
              });
            } else {
              console.warn('⚠️ Não foi possível obter cdCarrinho');
              this.mostrarToast('Item removido localmente', 'success');
            }
          },
          error: (err) => {
            console.error('❌ Erro ao buscar carrinho:', err);
            this.mostrarToast('Item removido localmente', 'success');
          }
        });
      } else {
        console.log('⚠️ Usuário não logado, removido apenas localmente');
        this.mostrarToast('Item removido do carrinho!', 'success');
      }
    }
  }
}

  calcularSubtotal(): number {
    return this.itensCarrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  calcularTotal(): number {
    return this.calcularSubtotal();
  }

  finalizarCompra(): void {
    if (this.itensCarrinho.length === 0) {
      this.mostrarToast('Seu carrinho está vazio!', 'error');
      return;
    }

    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

    if (!usuario) {
      this.mostrarToast('Você precisa estar logado para finalizar!', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.salvarCarrinhoLocal();
    this.router.navigate(['/finalizar-compra']);
  }

  private salvarCarrinhoLocal(): void {
    localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
  }

  mostrarToast(mensagem: string, tipo: 'success' | 'error' = 'success') {
    this.toastMessage = mensagem;
    this.toastType = tipo;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  fecharToast() {
    this.showToast = false;
  }
}