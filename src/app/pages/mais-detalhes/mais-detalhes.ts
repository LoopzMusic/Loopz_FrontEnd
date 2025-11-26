import { Component, ElementRef, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardAvaliacao } from '../../components/card-avaliacao/card-avaliacao';
import { ProdutoService } from '../../services/produto-service';
import { Produto } from '../../shared/models/Produto';
import { Card } from '../../components/card/card';
import { FavoritosService } from '../../services/acoesUsuario/favorito-service/favorito-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-mais-detalhes',
  imports: [RouterLink, CardAvaliacao, Card],
  templateUrl: './mais-detalhes.html',
  styleUrl: './mais-detalhes.scss',
})
export class MaisDetalhes implements OnInit {
  private produtoService = inject(ProdutoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private favoritosService = inject(FavoritosService);
  private authService = inject(AuthService);

  @ViewChild('toastCarrinho') toastCarrinho!: ElementRef;

  protected produtos: Produto[] = [];
  produto: Produto = new Produto();
  favorito = false;
  @ViewChild('toastFavorito') toastFavorito!: ElementRef;

  // avaliacoes: Avaliacao[] = [];

  constructor() {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.produtoService.buscarProdutoPorId(id).subscribe((response) => {
      this.produto = response;
      this.verificarFavorito();
    });
  }

  verificarFavorito() {
    const usuario = this.authService.getUsuarioLogado();
    
    if (usuario && usuario.cdUsuario) {
      const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      this.favorito = favoritos.some((p: any) => p.cdProduto === this.produto.cdProduto);
    } else {
      this.favorito = false;
    }
  }

  adicionarFavorito() {
    const usuario = this.authService.getUsuarioLogado();
    
    if (!usuario || !usuario.cdUsuario) {
      this.showToast("Você precisa estar logado!");
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

          this.produtoService.listarProdutos().subscribe((response) => (this.produtos = response));
          
          this.showToast("Removido dos favoritos!");
        },
        error: (error) => {
          console.error('Erro ao remover favorito:', error);
          this.showToast("Erro ao remover dos favoritos!");
        }
      });
    } else {
      
      this.favoritosService.adicionarFavorito(this.produto.cdProduto, cdusuario).subscribe({
        next: (response) => {
          console.log('Favorito adicionado:', response);
          
          let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
          favoritos.push(this.produto);
          localStorage.setItem('favoritos', JSON.stringify(favoritos));

          this.favorito = true;
          this.showToast("Adicionado aos favoritos!");
        },
        error: (error) => {
          console.error('Erro ao adicionar favorito:', error);
          this.showToast("Erro ao adicionar aos favoritos!");
        }
      });
    }
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
  showToast(msg: string) {
    this.toastFavorito.nativeElement.querySelector('.toast-body').textContent = msg;

    // @ts-ignore
    const toast = new bootstrap.Toast(this.toastFavorito.nativeElement);
    toast.show();
  }

  // this.produtoService.buscarAvaliacoesPorProdutoId(id).subscribe(response => {
  //   this.avaliacoes = response;
  // });
}
