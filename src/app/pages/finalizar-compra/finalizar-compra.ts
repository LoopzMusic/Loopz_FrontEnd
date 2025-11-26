import { Component, signal, WritableSignal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  complemento: string;
  numero: string;
}

interface ItemCarrinho {
  cdProduto: number;
  nome: string;
  preco: number;
  quantidade: number;
}

@Component({
  selector: 'app-finalizar-compra',
  imports: [],
  templateUrl: './finalizar-compra.html',
  styleUrl: './finalizar-compra.scss',
})
export class FinalizarCompra {
  constructor(private http: HttpClient, private router: Router) { }

  endereco: WritableSignal<Endereco> = signal({
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    complemento: '',
    numero: ''
  });

  itensCarrinho: WritableSignal<ItemCarrinho[]> = signal([
    { cdProduto: 1, nome: 'Violão Clássico Loopz Pro', preco: 899.90, quantidade: 1 }
  ]);

  pagamento = signal<string>('credito');

  frete = signal<number>(0);

  subtotal = signal<number>(0);

  ngOnInit() {
    this.calcularSubtotal();
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
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        alert('CEP não encontrado!');
        return;
      }

      // Preenche automaticamente usando signals
      this.endereco.update((end) => ({
        ...end,
        cep: cep,
        logradouro: data.logradouro ?? '',
        bairro: data.bairro ?? '',
        localidade: data.localidade ?? '',
        uf: data.uf ?? ''
      }));

      // calcula o frete
      this.calcularFretePorCep(cep);
    })
    .catch(() => alert('Erro ao buscar CEP.'));
}

  calcularFretePorCep(cep: string) {
    const prefixo = Number(cep.substring(0, 2));

    let valorFrete = 0;

    // Simulação de regras
    if (prefixo >= 80 && prefixo <= 89) valorFrete = 10;  // PR
    else if (prefixo >= 90 && prefixo <= 99) valorFrete = 15; // RS
    else if (prefixo >= 0 && prefixo <= 29) valorFrete = 20; // Sudeste
    else valorFrete = 30;

    this.frete.set(valorFrete);
  }

  calcularSubtotal() {
    const total = this.itensCarrinho().reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
    this.subtotal.set(Number(total.toFixed(2)));
  }

  selecionarPagamento(tipo: string) {
    this.pagamento.set(tipo);
  }

  confirmarPedido() {
    if (!this.endereco().cep) {
      alert('Informe o CEP antes de confirmar o pedido.');
      return;
    }

    const pedido = {
      itens: this.itensCarrinho(),
      endereco: this.endereco(),
      pagamento: this.pagamento(),
      frete: this.frete(),
      total: this.subtotal() + this.frete()
    };

    console.log('Pedido confirmado:', pedido);

    // Simulação de resposta
    alert('Pedido confirmado com sucesso!');
    this.router.navigate(['/']);
  }
}
