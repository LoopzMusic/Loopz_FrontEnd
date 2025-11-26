import { Component, inject, OnInit } from '@angular/core';
import { Card } from "../../components/card/card";
import { FavoritosService } from '../../services/acoesUsuario/favorito-service/favorito-service';
import { AuthService } from '../../services/auth-service';
import { ProdutoService } from '../../services/produto-service';
import { Produto } from '../../shared/models/Produto';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-favoritos',
  imports: [Card, CommonModule, RouterLink],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.scss',
})
export class Favoritos implements OnInit {
  private favoritosService = inject(FavoritosService);
  private authService = inject(AuthService);
  private produtoService = inject(ProdutoService);

  favoritos: Produto[] = [];
  carregando = true;

  ngOnInit() {
    this.carregarFavoritos();
  }

  carregarFavoritos() {
    const usuario = this.authService.getUsuarioLogado();
    
    if (!usuario || !usuario.cdUsuario) {
      this.carregando = false;
      this.favoritos = [];
      return;
    }

  
    this.favoritosService.listarCdProdutosFavoritados(usuario.cdUsuario).subscribe({
      next: (cdProdutosFavoritados) => {
        if (cdProdutosFavoritados.length === 0) {
          this.favoritos = [];
          this.carregando = false;
          localStorage.setItem('favoritos', JSON.stringify([]));
          return;
        }

        
        const requests = cdProdutosFavoritados.map(cdProduto => 
          this.produtoService.buscarProdutoPorId(cdProduto)
        );

        forkJoin(requests).subscribe({
          next: (produtos) => {
            this.favoritos = produtos;
            this.carregando = false;
            
            
            localStorage.setItem('favoritos', JSON.stringify(produtos));
          },
          error: (error) => {
            console.error('Erro ao buscar produtos favoritos:', error);
            this.carregando = false;
            
            
            this.favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
          }
        });
      },
      error: (error) => {
        console.error('Erro ao buscar favoritos:', error);
        this.carregando = false;
        
        
        this.favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      }
    });
  }
}