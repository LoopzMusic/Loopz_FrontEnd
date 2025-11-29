import { Component, Input, ElementRef, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Produto } from '../../shared/models/Produto';
import { FavoritosService } from '../../services/acoesUsuario/favorito-service/favorito-service';
import { AuthService } from '../../services/auth-service';
import { CarrinhoService } from '../../services/carrinho/carrinho.service';
import { ShowToast } from '../show-toast/show-toast';

@Component({
  selector: 'app-card',
  imports: [RouterLink, ShowToast],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input({ required: true }) produto: Produto = new Produto();
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  };

  favorito = false;

  constructor(private router: Router) {}
  private favoritosService = inject(FavoritosService);
  private authService = inject(AuthService);
  private carrinhoService = inject(CarrinhoService);

  ngOnInit() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    this.favorito = favoritos.some((p: any) => p.cdProduto === this.produto.cdProduto);
  }

  adicionarFavorito() {
    const usuario = this.authService.getUsuarioLogado();

    // ✅ VERIFICAR SE ESTÁ LOGADO
    if (!usuario || !usuario.cdUsuario) {
      this.showToast('Você precisa estar logado!', 'error');
      return;
    }

    // ✅ VERIFICAR SE PERFIL ESTÁ COMPLETO
    if (!usuario.profileComplete) {
      this.showToast('Complete seu perfil antes de favoritar produtos!', 'error');
      return;
    }

    const cdusuario = usuario.cdUsuario;

    if (this.favorito) {
      this.favoritosService.removerFavorito(cdusuario, this.produto.cdProduto).subscribe({
        next: () => {
          let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
          favoritos = favoritos.filter((p: any) => p.cdProduto !== this.produto.cdProduto);
          localStorage.setItem('favoritos', JSON.stringify(favoritos));

          this.favorito = false;

          if (this.router.url.includes('favoritos')) {
            this.router.navigate(['/produtos']);
          }

          this.showToast('Removido dos favoritos!', 'error');
        },
        error: (error) => {
          console.error('Erro ao remover favorito:', error);
          this.showToast('Erro ao remover dos favoritos!', 'error');
        },
      });
    } else {
      this.favoritosService.adicionarFavorito(this.produto.cdProduto, cdusuario).subscribe({
        next: (response) => {
          console.log('Favorito adicionado:', response);

          let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
          favoritos.push(this.produto);
          localStorage.setItem('favoritos', JSON.stringify(favoritos));

          this.favorito = true;
          this.showToast('Adicionado aos favoritos!');
        },
        error: (error) => {
          console.error('Erro ao adicionar favorito:', error);
          this.showToast('Erro ao adicionar aos favoritos!', 'error');
        },
      });
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast = { show: true, message, type };

    setTimeout(() => {
      this.toast.show = false;
    }, 800);
  }

  fecharToast() {
    this.toast.show = false;
  }
  adicionarAoCarrinho() {
    const usuario = this.authService.getUsuarioLogado();

    // ✅ VERIFICAR SE ESTÁ LOGADO
    if (!usuario || !usuario.cdUsuario) {
      this.showToast('Você precisa estar logado para adicionar ao carrinho!', 'error');
      return;
    }

    // ✅ VERIFICAR SE PERFIL ESTÁ COMPLETO
    if (!usuario.profileComplete) {
      this.showToast('Complete seu perfil antes de adicionar produtos ao carrinho!', 'error');
      return;
    }

    const item = {
      cdProduto: this.produto.cdProduto,
      nome: this.produto.nmProduto,
      marca: this.produto.dsCategoria ?? 'Não informado',
      preco: this.produto.vlProduto,
      quantidade: 1,
      estoque: this.produto.qtdEstoqueProduto,
      imagem: `http://localhost:8085/produto/${this.produto.cdProduto}/imagem`,
    };

    this.carrinhoService.adicionarItem(item).subscribe({
      next: () => {
        this.showToast('Produto adicionado ao carrinho!');
      },
      error: (error) => {
        console.error('Erro ao adicionar ao carrinho:', error);
        this.showToast('Erro ao adicionar ao carrinho!', 'error');
      },
    });
  }
}
