// src/app/components/criar-feedback/criar-feedback.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FeedbackService } from '../../services/acoesUsuario/feedback-service/feedback-service';
import { AuthService } from '../../services/auth-service';

/**
 * Componente para criar/enviar feedback de produto
 */
@Component({
  selector: 'app-criar-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-feedback.html',
  styleUrl: './criar-feedback.scss'
})
export class CriarFeedback {
  
  @Input() cdProduto!: number;

  
  @Output() feedbackCriado = new EventEmitter<void>();

  feedbackForm: FormGroup;
  enviando = false;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {
    this.feedbackForm = this.fb.group({
      nuAvaliacao: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      dsComentario: ['', Validators.maxLength(500)]
    });
  }

 
  onSubmit(): void {
    if (!this.feedbackForm.valid) {
      return;
    }

    const usuario = this.authService.getUsuarioLogado();
    
    if (!usuario || !usuario.cdUsuario) {
      this.mensagemErro = 'Você precisa estar logado para avaliar!';
      return;
    }

    this.enviando = true;
    this.mensagemSucesso = null;
    this.mensagemErro = null;

    const feedbackData = {
      cdUsuario: usuario.cdUsuario,
      cdProduto: this.cdProduto,
      nuAvaliacao: this.feedbackForm.value.nuAvaliacao,
      dsComentario: this.feedbackForm.value.dsComentario || ''
    };

    this.feedbackService.criarFeedback(feedbackData).subscribe({
      next: (response) => {
        this.mensagemSucesso = 'Avaliação enviada com sucesso!';
        this.feedbackForm.reset();
        this.enviando = false;
        
        
        this.feedbackCriado.emit();

       
        setTimeout(() => {
          this.mensagemSucesso = null;
        }, 3000);
      },
      error: (error) => {
        this.mensagemErro = error.message;
        this.enviando = false;
      }
    });
  }

 
  getEstrelas(quantidade: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  selecionarAvaliacao(estrelas: number): void {
    this.feedbackForm.patchValue({ nuAvaliacao: estrelas });
  }

 
  get caracteresDigitados(): number {
    return this.feedbackForm.get('dsComentario')?.value?.length || 0;
  }
}