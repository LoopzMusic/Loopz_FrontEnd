import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../shared/models/LoginRequest';
import { Observable, tap } from 'rxjs';
import { UsuarioCadastro } from '../pages/cadastro/cadastro';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8085/auth';
  private usuarioLogado: any = null;

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest, isAdmin: boolean): Observable<any> {
    const url = isAdmin ? `${this.baseUrl}/login` : `${this.baseUrl}/login`;

    return this.http.post(url, loginData).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        if (response.cdUsuario) {
          const usuario = {
            cdUsuario: response.cdUsuario,
            dsEmail: response.dsEmail,
            userRole: response.userRole,
          };
          this.setUsuario(usuario);
        }
        this.sincronizarCarrinhoAposLogin();
      })
    );
  }

  cadastrar(usuario: UsuarioCadastro) {
    return this.http.post(`${this.baseUrl}/register`, usuario);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUsuario(usuario: any) {
    this.usuarioLogado = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuarioLogado() {
    if (!this.usuarioLogado) {
      const u = localStorage.getItem('usuario');
      if (u) this.usuarioLogado = JSON.parse(u);
    }
    return this.usuarioLogado;
  }

  logout() {
    this.usuarioLogado = null;
    localStorage.removeItem('carrinho');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('favoritos');
  }
  private sincronizarCarrinhoAposLogin(): void {
    // Importação dinâmica para evitar dependência circular
    import('../services/carrinho/carrinho.service').then((module) => {
      const carrinhoService = new module.CarrinhoService();

      // Primeiro, carrega o carrinho do backend
      carrinhoService.carregarCarrinhoDoBackend().subscribe({
        next: () => {
          console.log('Carrinho carregado do backend com sucesso');

          // Depois, sincroniza itens locais (se houver)
          carrinhoService.sincronizarCarrinho().subscribe({
            next: () => console.log('Carrinho sincronizado com sucesso'),
            error: (err) => console.error('Erro ao sincronizar carrinho:', err),
          });
        },
        error: (err) => console.error('Erro ao carregar carrinho do backend:', err),
      });
    });
  }
}
