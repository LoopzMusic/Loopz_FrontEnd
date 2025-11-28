// src/app/models/feedback.interface.ts

export interface FeedbackRequest {
  cdUsuario: number;
  cdProduto: number;
  nuAvaliacao: number;
  dsComentario?: string;
}

export interface FeedbackResponse {
  cdFeedBack: number;
  nuAvaliacao: number;
  dsComentario: string;
  cdUsuario: number;
  nmCliente: string;
  cdProduto: number;
  nmProduto: string;
  
}

export interface FeedbackListResponse {
  cdFeedBack: number;
  nuAvaliacao: number;
  dsComentario: string;
  nmCliente: string;
  nmProduto: string;
  dtCriacao?: string;
}