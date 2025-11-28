import { Component, OnInit, inject } from '@angular/core';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../../services/acoesUsuario/feedback-service/feedback-service';
import { FeedbackListResponse } from '../../../shared/models/FeedBack';

@Component({
  selector: 'app-avaliacoes',
  imports: [CommonModule, Sidebar],
  templateUrl: './avaliacoes.html',
  styleUrl: './avaliacoes.scss',
})
export class Avaliacoes implements OnInit {
  
  private feedbackService = inject(FeedbackService);

  avaliacoes: FeedbackListResponse[] = [];
  avaliacoesFiltradas: FeedbackListResponse[] = [];
  filtroEstrelas: number = 0;
  carregando: boolean = true;

  ngOnInit(): void {
    this.carregarAvaliacoes();
  }

  carregarAvaliacoes(): void {
    this.carregando = true;
    
    this.feedbackService.listarTodosFeedbacks().subscribe({
      next: (data) => {
        console.log('Feedbacks recebidos:', data);
        this.avaliacoes = data;
        this.avaliacoesFiltradas = [...data];
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar avaliações:', error);
        this.carregando = false;
      }
    });
  }

  filtrarPorEstrelas(estrelas: number): void {
    this.filtroEstrelas = estrelas;
    
    if (estrelas === 0) {
      this.avaliacoesFiltradas = [...this.avaliacoes];
    } else {
      this.avaliacoesFiltradas = this.avaliacoes.filter(a => a.nuAvaliacao === estrelas);
    }
  }

  getFiltroLabel(): string {
    if (this.filtroEstrelas === 0) {
      return 'Todas as notas';
    }
    return `${this.filtroEstrelas} estrela${this.filtroEstrelas !== 1 ? 's' : ''}`;
  }

  getEstrelas(quantidade: number): number[] {
    return Array(quantidade).fill(0);
  }
}