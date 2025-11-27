import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empresa {
  cdEmpresa?: number;
  nmFantasia: string;
  nmRazao: string;
  nuCNPJ: string;
  nuTelefone: string;
  dsCidade: string;
  dsEstado: string;
  dsEndereco: string;
  nuEndereco: string;
  flAtivo?: string;
  produtos?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8085/empresa';

  criarEmpresa(empresa: Empresa): Observable<any> {
    return this.http.post(`${this.apiUrl}/criar`, empresa);
  }

  listarEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/listar/todos`);
  }

  buscarEmpresaPorCNPJ(cnpj: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/listarCNPJ/${cnpj}`);
  }

  atualizarEmpresa(cdEmpresa: number, empresa: Empresa): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${cdEmpresa}`, empresa);
  }

  deletarEmpresa(cdEmpresa: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${cdEmpresa}`);
  }
}