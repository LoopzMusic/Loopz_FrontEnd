import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CnpjApiService {

  private apiUrl = 'https://brasilapi.com.br/api/cnpj/v1';

  constructor(private http: HttpClient) {}

  consultarCnpj(cnpj: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${cnpj}`);
  }
}

