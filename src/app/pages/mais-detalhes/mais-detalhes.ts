import { Component, ElementRef, inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardAvaliacao } from '../../components/card-avaliacao/card-avaliacao';
import { ProdutoService } from '../../services/produto-service';
import { Produto } from '../../shared/models/Produto';
import { Card } from '../../components/card/card';
import { FavoritosService } from '../../services/acoesUsuario/favorito-service/favorito-service';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mais-detalhes',
  imports: [RouterLink, CardAvaliacao, Card, CommonModule],
  templateUrl: './mais-detalhes.html',
  styleUrl: './mais-detalhes.scss',
})
export class MaisDetalhes implements OnInit, OnDestroy {
  private produtoService = inject(ProdutoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private favoritosService = inject(FavoritosService);
  private authService = inject(AuthService);

  @ViewChild('toastCarrinho') toastCarrinho!: ElementRef;
  @ViewChild('toastFavorito') toastFavorito!: ElementRef;

  protected produtos: Produto[] = [];
  produto: Produto = new Produto();
  favorito = false;
  carregandoRecomendados = false;
  
  private routeSub?: Subscription;

  constructor() {}

  ngOnInit(): void {
    
    this.routeSub = this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.carregarProduto(id);
    });
  }

  ngOnDestroy(): void {
  
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  carregarProduto(cd: number): void {
     
    this.produtoService.buscarProdutoPorId(cd).subscribe((response) => {
      this.produto = response;
      this.verificarFavorito();
      this.carregarProdutosRecomendados(cd);
    });
  }

  carregarProdutosRecomendados(cdProduto: number): void {
    this.carregandoRecomendados = true;

    this.produtoService.buscarProdutosRecomendados(cdProduto).subscribe({
      next: (produtosRecomendados) => {
        this.produtos = produtosRecomendados;
        this.carregandoRecomendados = false;

        if (this.produtos.length === 0) {
          this.carregarProdutosFallback();
        }
      },
      error: (error) => {
        console.error('Erro ao buscar produtos recomendados:', error);
        this.carregandoRecomendados = false;
        this.carregarProdutosFallback();
      }
    });
  }
  carregarProdutosFallback(): void {
    
    this.produtoService.listarProdutos().subscribe({
      next: (todosProdutos) => {
        this.produtos = todosProdutos
          .filter(p => p.cdProduto !== this.produto.cdProduto)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Erro ao buscar produtos fallback:', error);
        this.produtos = [];
      }
    });
  }

  verificarFavorito(): void {
    const usuario = this.authService.getUsuarioLogado();
    
    if (usuario && usuario.cdUsuario) {
      const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      this.favorito = favoritos.some((p: any) => p.cdProduto === this.produto.cdProduto);
    } else {
      this.favorito = false;
    }
  }

  adicionarFavorito(): void {
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

  showToast(msg: string): void {
    this.toastFavorito.nativeElement.querySelector('.toast-body').textContent = msg;
    // @ts-ignore
    const toast = new bootstrap.Toast(this.toastFavorito.nativeElement);
    toast.show();
  }

  showToastCarrinho(msg: string): void {
    this.toastCarrinho.nativeElement.querySelector('.toast-body').textContent = msg;
    // @ts-ignore
    const toast = new bootstrap.Toast(this.toastCarrinho.nativeElement);
    toast.show();
  }

  adicionarAoCarrinho(qtdInput: HTMLInputElement): void {
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

  aumentarQtd(input: HTMLInputElement): void {
    const atual = Number(input.value);
    if (atual < this.produto.qtdEstoqueProduto) {
      input.value = (atual + 1).toString();
    }
  }

  diminuirQtd(input: HTMLInputElement): void {
    const atual = Number(input.value);
    if (atual > 1) {
      input.value = (atual - 1).toString();
    }
  }
}