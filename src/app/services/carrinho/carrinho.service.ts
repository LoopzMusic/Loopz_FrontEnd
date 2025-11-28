import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';

export interface ItemCarrinho {
  cdItemCarrinho?: number;
  cdProduto: number;
  nome: string;
  marca: string;
  preco: number;
  quantidade: number;
  estoque: number;
  imagem: string;
}

export interface CarrinhoResponse {
  cdCarrinho: number;
  cdUsuario: number;
  nomeUsuario: string;
  itens: ItemCarrinhoDto[];
  status: string;
  valorTotalCarrinho: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemCarrinhoDto {
  cdItemCarrinho: number;
  cdProduto: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  valorTotalItem: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8085';

  // Observable para notificar mudanças no carrinho
  private carrinhoAtualizado$ = new BehaviorSubject<void>(undefined);
  public carrinhoObservable$ = this.carrinhoAtualizado$.asObservable();

  constructor() {
    // NÃO injeta AuthService para evitar dependência circular
  }

  /**
   * Obtém usuário logado diretamente do localStorage (sem depender de AuthService)
   */
  private getUsuario(): any {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  /**
   * Busca ou cria o carrinho do usuário logado
   */
  buscarOuCriarCarrinho(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carrinhos/meu-carrinho`).pipe(
      tap(() => this.notificarAtualizacao()),
      catchError((error) => {
        console.error('Erro ao buscar carrinho:', error);
        return of(null);
      })
    );
  }

  /**
   * Busca detalhes completos do carrinho
   */
  buscarDetalhesCarrinho(): Observable<CarrinhoResponse | null> {
    return this.http.get<CarrinhoResponse>(`${this.apiUrl}/carrinhos/meu-carrinho/detalhes`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar detalhes do carrinho:', error);
        return of(null);
      })
    );
  }

  /**
   * Adiciona item ao carrinho (sincroniza localStorage + backend)
   */
  adicionarItem(item: ItemCarrinho): Observable<any> {
    console.log('➕ Adicionando item ao carrinho:', item);

    const usuario = this.getUsuario();

    if (!usuario || !usuario.cdUsuario) {
      console.log('⚠️ Usuário não logado, salvando apenas no localStorage');
      this.atualizarLocalStorage(item);
      this.notificarAtualizacao();
      return of(null);
    }

    console.log('🔄 Usuário logado, salvando no backend e localStorage');

    return this.buscarOuCriarCarrinho().pipe(
      switchMap((carrinho) => {
        if (!carrinho || !carrinho.cdCarrinho) {
          console.error('❌ Erro: Não foi possível obter o carrinho');
          throw new Error('Não foi possível obter o carrinho');
        }

        console.log('✅ Carrinho obtido:', carrinho);

        const itemDto = {
          cdProduto: item.cdProduto,
          qtdItemCarrinho: item.quantidade,
        };

        console.log('📤 Enviando para backend:', itemDto);

        return this.http.post(
          `${this.apiUrl}/itemcarrinhos/carrinhos/${carrinho.cdCarrinho}/itens`,
          itemDto
        );
      }),
      tap((response) => {
        console.log('✅ Item adicionado no backend:', response);
        this.atualizarLocalStorage(item);
        this.notificarAtualizacao();
      }),
      catchError((error) => {
        console.error('❌ Erro ao adicionar item no backend:', error);
        console.log('🔄 Fallback: salvando apenas no localStorage');
        this.atualizarLocalStorage(item);
        this.notificarAtualizacao();
        return of(null);
      })
    );
  }

  /**
   * Atualiza quantidade de um item
   */
  atualizarQuantidade(cdItemCarrinho: number, novaQuantidade: number): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/itemcarrinhos/itens-carrinho/${cdItemCarrinho}`, {
        qtdItemCarrinho: novaQuantidade,
      })
      .pipe(
        tap(() => this.notificarAtualizacao()),
        catchError((error) => {
          console.error('Erro ao atualizar quantidade:', error);
          return of(null);
        })
      );
  }

  /**
   * Remove item do carrinho
   */
  removerItem(cdProduto: number): void {
    let carrinho = this.obterCarrinhoLocal();
    carrinho = carrinho.filter((item) => item.cdProduto !== cdProduto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    this.notificarAtualizacao();
  }

  /**
   * Limpa completamente o carrinho (local e backend)
   */
  limparCarrinho(): Observable<any> {
    const usuario = this.getUsuario();

    if (!usuario || !usuario.cdUsuario) {
      localStorage.removeItem('carrinho');
      this.notificarAtualizacao();
      return of(null);
    }

    return this.http.delete(`${this.apiUrl}/carrinhos/meu-carrinho/limpar`).pipe(
      tap(() => {
        localStorage.removeItem('carrinho');
        this.notificarAtualizacao();
      }),
      catchError((error) => {
        console.error('Erro ao limpar carrinho:', error);
        localStorage.removeItem('carrinho');
        this.notificarAtualizacao();
        return of(null);
      })
    );
  }

  /**
   * Finaliza carrinho (muda status para FINALIZADO)
   */
  finalizarCarrinho(cdCarrinho: number): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/carrinhos/${cdCarrinho}/status`, { statusCarrinho: 'FINALIZADO' })
      .pipe(
        tap(() => {
          localStorage.removeItem('carrinho');
          this.notificarAtualizacao();
        }),
        catchError((error) => {
          console.error('Erro ao finalizar carrinho:', error);
          return of(null);
        })
      );
  }

  /**
   * Sincroniza carrinho local com o backend ao fazer login
   */
  sincronizarCarrinho(): Observable<any> {
    const carrinhoLocal = this.obterCarrinhoLocal();

    if (carrinhoLocal.length === 0) {
      return of(null);
    }

    return this.buscarOuCriarCarrinho().pipe(
      switchMap((carrinho) => {
        if (!carrinho || !carrinho.cdCarrinho) {
          return of(null);
        }

        const requests = carrinhoLocal.map((item) => {
          const itemDto = {
            cdProduto: item.cdProduto,
            qtdItemCarrinho: item.quantidade,
          };

          return this.http
            .post(`${this.apiUrl}/itemcarrinhos/carrinhos/${carrinho.cdCarrinho}/itens`, itemDto)
            .pipe(catchError(() => of(null)));
        });

        return forkJoin(requests);
      }),
      tap(() => this.notificarAtualizacao())
    );
  }

  /**
   * Carrega carrinho do backend para o localStorage
   */
  carregarCarrinhoDoBackend(): Observable<void> {
    console.log('🔄 Iniciando carregamento do carrinho do backend...');

    return this.buscarDetalhesCarrinho().pipe(
      tap((carrinho) => {
        console.log('📦 Resposta do backend:', carrinho);

        if (carrinho && carrinho.itens && carrinho.itens.length > 0) {
          const carrinhoLocal: ItemCarrinho[] = carrinho.itens.map((item) => ({
            cdItemCarrinho: item.cdItemCarrinho,
            cdProduto: item.cdProduto,
            nome: item.nomeProduto,
            marca: 'Não informado',
            preco: item.precoUnitario,
            quantidade: item.quantidade,
            estoque: 999,
            imagem: `http://localhost:8085/produto/${item.cdProduto}/imagem`,
          }));

          console.log('✅ Salvando no localStorage:', carrinhoLocal);
          localStorage.setItem('carrinho', JSON.stringify(carrinhoLocal));
          this.notificarAtualizacao();
        } else {
          console.warn('⚠️ Carrinho vazio ou sem itens no backend');
        }
      }),
      map(() => undefined),
      catchError((error) => {
        console.error('❌ Erro ao carregar carrinho do backend:', error);
        return of(undefined);
      })
    );
  }

  /**
   * Obtém carrinho do localStorage
   */
  obterCarrinhoLocal(): ItemCarrinho[] {
    const carrinhoStr = localStorage.getItem('carrinho');
    return carrinhoStr ? JSON.parse(carrinhoStr) : [];
  }

  /**
   * Calcula total do carrinho local
   */
  calcularTotal(): number {
    const carrinho = this.obterCarrinhoLocal();
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  /**
   * Conta quantidade de itens no carrinho
   */
  contarItens(): number {
    const carrinho = this.obterCarrinhoLocal();
    return carrinho.reduce((total, item) => total + item.quantidade, 0);
  }

  // ===== MÉTODOS PRIVADOS =====

  private atualizarLocalStorage(novoItem: ItemCarrinho): void {
    console.log('💾 Atualizando localStorage com:', novoItem);

    let carrinho = this.obterCarrinhoLocal();
    console.log('📦 Carrinho atual no localStorage:', carrinho);

    const itemExistente = carrinho.find((item) => item.cdProduto === novoItem.cdProduto);

    if (itemExistente) {
      console.log('🔄 Item já existe, incrementando quantidade');
      itemExistente.quantidade += novoItem.quantidade;
    } else {
      console.log('➕ Item novo, adicionando ao carrinho');
      carrinho.push(novoItem);
    }

    console.log('✅ Salvando carrinho atualizado:', carrinho);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }

  private notificarAtualizacao(): void {
    this.carrinhoAtualizado$.next();
  }
}
