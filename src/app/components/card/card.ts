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

    if (!usuario || !usuario.cdUsuario) {
      this.showToast('Você precisa estar logado!');
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

          this.showToast('Removido dos favoritos!');
        },
        error: (error) => {
          console.error('Erro ao remover favorito:', error);
          this.showToast('Erro ao remover dos favoritos!');
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
          this.showToast('Erro ao adicionar aos favoritos!');
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

    const item = {
      cdProduto: this.produto.cdProduto,
      nome: this.produto.nmProduto,
      marca: this.produto.dsCategoria ?? 'Não informado',
      preco: this.produto.vlProduto,
      quantidade: 1,
      estoque: this.produto.qtdEstoqueProduto,
      imagem: `http://localhost:8085/produto/${this.produto.cdProduto}/imagem`,
    };

    if (usuario && usuario.cdUsuario) {
      // Se estiver logado, adiciona via serviço (sincroniza com backend)
      this.carrinhoService.adicionarItem(item).subscribe({
        next: () => {
          this.showToast('Produto adicionado ao carrinho!');
        },
        error: (error) => {
          console.error('Erro ao adicionar ao carrinho:', error);
          this.showToast('Erro ao adicionar ao carrinho!');
        },
      });
    } else {
      // Se não estiver logado, adiciona apenas no localStorage
      let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
      const itemExistente = carrinho.find((i: any) => i.cdProduto === item.cdProduto);

      if (itemExistente) {
        itemExistente.quantidade++;
      } else {
        carrinho.push(item);
      }

      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      this.showToast('Produto adicionado ao carrinho!');
    }
  }
}
