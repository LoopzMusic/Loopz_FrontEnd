// src/app/components/card-avaliacao/card-avaliacao.component.ts

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../services/acoesUsuario/feedback-service/feedback-service';
import { FeedbackListResponse } from '../../shared/models/FeedBack';

/**
 * Componente para exibir avaliações de produtos
 * Pode ser usado de duas formas:
 * 1. Passando [cdProduto] - carrega todas as avaliações do produto
 * 2. Passando [avaliacao] - exibe uma avaliação específica
 */
@Component({
  selector: 'app-card-avaliacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-avaliacao.html',
  styleUrl: './card-avaliacao.scss',
})
export class CardAvaliacao implements OnChanges {

  @Input() cdProduto?: number;
  

  @Input() avaliacao?: FeedbackListResponse;
  
  
  avaliacoes: FeedbackListResponse[] = [];
  
 
  loading = false;
  
  
  erro: string | null = null;

  constructor(private feedbackService: FeedbackService) {}

  ngOnChanges(): void {
    
    if (this.cdProduto) {
      this.carregarAvaliacoesPorProduto(this.cdProduto);
    }
  }

  
  carregarAvaliacoesPorProduto(cdProduto: number): void {
    this.loading = true;
    this.erro = null;

    this.feedbackService.listarFeedbacksPorProduto(cdProduto).subscribe({
      next: (data) => {
        this.avaliacoes = data;
        this.loading = false;
      },
      error: (error) => {
        this.erro = error.message;
        this.loading = false;
        console.error('Erro ao carregar avaliações:', error);
      }
    });
  }

  carregarTodasAvaliacoes(): void {
    this.loading = true;
    this.erro = null;

    this.feedbackService.listarTodosFeedbacks().subscribe({
      next: (data) => {
        this.avaliacoes = data;
        this.loading = false;
      },
      error: (error) => {
        this.erro = error.message;
        this.loading = false;
        console.error('Erro ao carregar avaliações:', error);
      }
    });
  }

  getEstrelas(quantidade: number): number[] {
    return Array(quantidade).fill(0);
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  recarregar(): void {
    if (this.cdProduto) {
      this.carregarAvaliacoesPorProduto(this.cdProduto);
    } else {
      this.carregarTodasAvaliacoes();
    }
  }
}