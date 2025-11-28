import { Component, signal, WritableSignal, effect, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho/carrinho.service';
import { AuthService } from '../../services/auth-service';

interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  complemento: string;
  numero: string;
}

@Component({
  selector: 'app-finalizar-compra',
  imports: [],
  templateUrl: './finalizar-compra.html',
  styleUrl: './finalizar-compra.scss',
})
export class FinalizarCompra implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private carrinhoService = inject(CarrinhoService);
  private authService = inject(AuthService);

  endereco: WritableSignal<Endereco> = signal({
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    complemento: '',
    numero: '',
  });

  itensCarrinho: WritableSignal<ItemCarrinho[]> = signal([]);
  pagamento = signal<string>('credito');
  frete = signal<number>(0);
  subtotal = signal<number>(0);
  processando = false;

  ngOnInit() {
    this.carregarCarrinho();
    this.calcularSubtotal();
  }

  carregarCarrinho() {
    const carrinhoLocal = this.carrinhoService.obterCarrinhoLocal();

    if (carrinhoLocal.length === 0) {
      alert('Carrinho vazio! Redirecionando...');
      this.router.navigate(['/carrinho']);
      return;
    }

    this.itensCarrinho.set(carrinhoLocal);
  }

  atualizarEndereco(campo: keyof Endereco, valor: string) {
    this.endereco.update((end) => ({ ...end, [campo]: valor }));
  }

  buscarCep(): void {
    const cepInput = document.getElementById('cep') as HTMLInputElement;

    if (!cepInput) return;

    let cep = String(cepInput.value).replace(/\D/g, '');

    if (cep.length !== 8) {
      alert('CEP inválido!');
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          alert('CEP não encontrado!');
          return;
        }

        this.endereco.update((end) => ({
          ...end,
          cep: cep,
          logradouro: data.logradouro ?? '',
          bairro: data.bairro ?? '',
          localidade: data.localidade ?? '',
          uf: data.uf ?? '',
        }));

        this.calcularFretePorCep(cep);
      })
      .catch(() => alert('Erro ao buscar CEP.'));
  }

  calcularFretePorCep(cep: string) {
    const prefixo = Number(cep.substring(0, 2));
    let valorFrete = 0;

    if (prefixo >= 80 && prefixo <= 89) valorFrete = 10;
    else if (prefixo >= 90 && prefixo <= 99) valorFrete = 15;
    else if (prefixo >= 0 && prefixo <= 29) valorFrete = 20;
    else valorFrete = 30;

    this.frete.set(valorFrete);
  }

  calcularSubtotal() {
    const total = this.itensCarrinho().reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    this.subtotal.set(Number(total.toFixed(2)));
  }

  selecionarPagamento(tipo: string) {
    this.pagamento.set(tipo);
  }

  async confirmarPedido() {
    if (!this.endereco().cep) {
      alert('Informe o CEP antes de confirmar o pedido.');
      return;
    }

    const usuario = this.authService.getUsuarioLogado();

    if (!usuario || !usuario.cdUsuario) {
      alert('Você precisa estar logado para finalizar a compra!');
      this.router.navigate(['/login']);
      return;
    }

    this.processando = true;

    // 1. Busca/cria o carrinho no backend
    this.carrinhoService.buscarOuCriarCarrinho().subscribe({
      next: async (carrinhoResponse) => {
        if (!carrinhoResponse || !carrinhoResponse.cdCarrinho) {
          alert('Erro ao processar carrinho!');
          this.processando = false;
          return;
        }

        const cdCarrinho = carrinhoResponse.cdCarrinho;

        try {
          // 2. Cria o pedido
          const pedidoData = {
            cdUsuario: usuario.cdUsuario,
            formaPagamento: this.pagamento().toUpperCase(),
            vlFrete: this.frete(),
            vlTotalPedido: this.subtotal() + this.frete(),
          };

          const pedidoResponse: any = await this.http
            .post('http://localhost:8085/pedido/criar', pedidoData)
            .toPromise();

          if (!pedidoResponse || !pedidoResponse.cdPedido) {
            throw new Error('Erro ao criar pedido');
          }

          // 3. Cria itens do pedido
          const itensPedido = this.itensCarrinho().map((item) => ({
            cdPedido: pedidoResponse.cdPedido,
            cdProduto: item.cdProduto,
            vlItemPedido: item.preco,
            qtItem: item.quantidade,
          }));

          for (const itemPedido of itensPedido) {
            await this.http.post('http://localhost:8085/itempedido/criar', itemPedido).toPromise();
          }

          // 4. Finaliza o carrinho (muda status para FINALIZADO)
          await this.carrinhoService.finalizarCarrinho(cdCarrinho).toPromise();

          // 5. Limpa carrinho local
          this.carrinhoService.limparCarrinho().subscribe({
            next: () => {
              alert('Pedido confirmado com sucesso!');
              this.router.navigate(['/meus-pedidos']);
            },
            error: (err) => {
              console.error('Erro ao limpar carrinho:', err);
              // Mesmo com erro na limpeza, redireciona pois o pedido foi criado
              this.router.navigate(['/meus-pedidos']);
            },
          });
        } catch (error) {
          console.error('Erro ao processar pedido:', error);
          alert('Erro ao processar pedido. Tente novamente.');
        } finally {
          this.processando = false;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar carrinho:', error);
        alert('Erro ao processar carrinho!');
        this.processando = false;
      },
    });
  }
}
