// src/app/services/feedback.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  FeedbackRequest, 
  FeedbackResponse, 
  FeedbackListResponse 
} from '../../../shared/models/FeedBack';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8085/feedback'; 

  constructor(private http: HttpClient) {}

  
  criarFeedback(feedback: FeedbackRequest): Observable<FeedbackResponse> {
    return this.http
      .post<FeedbackResponse>(`${this.apiUrl}/criar/novofeedback`, feedback)
      .pipe(catchError(this.handleError));
  }

  
  listarTodosFeedbacks(): Observable<FeedbackListResponse[]> {
    return this.http
      .get<FeedbackListResponse[]>(`${this.apiUrl}/listar/todos`)
      .pipe(catchError(this.handleError));
  }

  
  listarFeedbacksPorProduto(cdProduto: number): Observable<FeedbackListResponse[]> {
    return this.http
      .get<FeedbackListResponse[]>(`${this.apiUrl}/listar/${cdProduto}`)
      .pipe(catchError(this.handleError));
  }

  deletarFeedback(cdFeedback: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/delete/${cdFeedback}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
     
      errorMessage = `Erro: ${error.error.message}`;
    } 
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}