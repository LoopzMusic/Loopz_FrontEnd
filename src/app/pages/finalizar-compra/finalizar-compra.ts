import { Component, signal, WritableSignal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho/carrinho.service';
import { AuthService } from '../../services/auth-service';
import { ShowToast } from '../../components/show-toast/show-toast';

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
  imports: [ShowToast, RouterModule],
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

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  itensCarrinho: WritableSignal<ItemCarrinho[]> = signal([]);
  pagamento = signal<string>('credito');
  frete = signal<number>(0);
  subtotal = signal<number>(0);
  processando = false;

  ngOnInit() {
    const usuario = this.authService.getUsuarioLogado();

    // ✅ BLOQUEIA SE USUÁRIO NÃO ESTÁ LOGADO
    if (!usuario || !usuario.cdUsuario) {
      this.mostrarToast('Você precisa estar logado para finalizar a compra!', 'error');
      this.router.navigate(['/login']);
      return;
    }

    // ✅ BLOQUEIA SE PERFIL ESTÁ INCOMPLETO
    if (!usuario.profileComplete) {
      this.mostrarToast('Complete seu perfil antes de finalizar a compra!', 'error');
      setTimeout(() => {
        this.router.navigate(['/perfil']);
      }, 2000);
      return;
    }

    // ✅ TUDO OK, CARREGA O CHECKOUT
    this.carregarCarrinho();
    this.calcularSubtotal();
  }

  carregarCarrinho() {
    const carrinhoLocal = this.carrinhoService.obterCarrinhoLocal();

    if (carrinhoLocal.length === 0) {
      this.mostrarToast('Carrinho vazio! Redirecionando...', 'error');
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
      this.mostrarToast('CEP inválido!', 'error');
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          this.mostrarToast('CEP não encontrado!', 'error');
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
      .catch(() => this.mostrarToast('Erro ao buscar CEP.', 'error'));
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
      this.mostrarToast('Informe o CEP antes de confirmar o pedido.', 'error');
      return;
    }

    const usuario = this.authService.getUsuarioLogado();

    if (!usuario || !usuario.cdUsuario) {
      this.mostrarToast('Você precisa estar logado para finalizar a compra!', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.processando = true;

    this.carrinhoService.buscarOuCriarCarrinho().subscribe({
      next: async (carrinhoResponse) => {
        if (!carrinhoResponse || !carrinhoResponse.cdCarrinho) {
          this.mostrarToast('Erro ao processar carrinho!', 'error');
          this.processando = false;
          return;
        }

        const cdCarrinho = carrinhoResponse.cdCarrinho;

        try {
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

          const itensPedido = this.itensCarrinho().map((item) => ({
            cdPedido: pedidoResponse.cdPedido,
            cdProduto: item.cdProduto,
            vlItemPedido: item.preco,
            qtItem: item.quantidade,
          }));

          for (const itemPedido of itensPedido) {
            await this.http.post('http://localhost:8085/itempedido/criar', itemPedido).toPromise();
          }

          await this.carrinhoService.finalizarCarrinho(cdCarrinho).toPromise();

          this.carrinhoService.limparCarrinho().subscribe({
            next: () => {
              this.mostrarToast('Pedido confirmado com sucesso!', 'success');
              this.router.navigate(['/meus-pedidos']);
            },
            error: (err) => {
              console.error('Erro ao limpar carrinho:', err);
              this.router.navigate(['/meus-pedidos']);
            },
          });
        } catch (error) {
          console.error('Erro ao processar pedido:', error);
          this.mostrarToast('Erro ao processar pedido. Tente novamente.', 'error');
        } finally {
          this.processando = false;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar carrinho:', error);
        this.mostrarToast('Erro ao processar carrinho!', 'error');
        this.processando = false;
      },
    });
  }

  mostrarToast(mensagem: string, tipo: 'success' | 'error' = 'success') {
    this.toastMessage = mensagem;
    this.toastType = tipo;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  fecharToast() {
    this.showToast = false;
  }
}
