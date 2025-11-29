import { Component, OnInit, inject } from '@angular/core';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../../services/usuario/pedidos/pedido';
import { PedidoResumoAdminTodos } from '../../../shared/models/usuario/PedidosUsuarios'; 
import { ShowToast } from '../../../components/show-toast/show-toast';

type StatusPedido = 'ABERTO' | 'ANDAMENTO' | 'FINALIZADO';

interface PedidoExibicao extends PedidoResumoAdminTodos {
  numero: string;
  dataFormatada: string;
  totalItens: number;
  status: StatusPedido;
}

@Component({
  selector: 'app-produto-vendido',
  imports: [CommonModule, Sidebar, ShowToast],
  templateUrl: './produto-vendido.html',
  styleUrl: './produto-vendido.scss',
})
export class ProdutoVendido implements OnInit {

  private pedidoService = inject(PedidoService);
  private router = inject(Router);

  pedidos: PedidoExibicao[] = [];
  pedidosFiltrados: PedidoExibicao[] = [];
  pedidoSelecionado: PedidoExibicao | null = null;
  carregando: boolean = true;
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  };



  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.carregando = true;

    this.pedidoService.listarTodosPedidosAdmin().subscribe({
      next: (data) => {
        console.log('Pedidos recebidos:', data);
        
        this.pedidos = data.map(pedido => ({
          ...pedido,
          numero: String(pedido.cdPedido).padStart(3, '0'),
          dataFormatada: pedido.dtFinalizacao 
            ? this.formatarData(pedido.dtFinalizacao) 
            : 'Sem data',
          totalItens: pedido.itens.length,
          status: pedido.statusPedido as StatusPedido 
        }));

        this.pedidosFiltrados = [...this.pedidos];
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
        this.carregando = false;
      }
    });
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  getStatusLabel(status: StatusPedido): string {
    const labels: Record<StatusPedido, string> = {
      'ABERTO': 'Aguardando Pagamento',
      'ANDAMENTO': 'Em Andamento',
      'FINALIZADO': 'Finalizado'
    };
    return labels[status];
  }

  getBadgeClass(status: StatusPedido): string {
    const classes: Record<StatusPedido, string> = {
      'ABERTO': 'badge-warning',
      'ANDAMENTO': 'badge-info',
      'FINALIZADO': 'badge-success'
    };
    return classes[status];
  }

  alterarStatus(cdPedido: number, novoStatus: StatusPedido): void {
    const pedido = this.pedidos.find(p => p.cdPedido === cdPedido);
    if (pedido) {
      pedido.status = novoStatus;

      this.pedidoService.atualizarStatusPedido(cdPedido).subscribe({
        next: () => {
          console.log('Status atualizado com sucesso!');
          this.carregarPedidos();
        },
        error: (error) => {
          console.error('Erro ao atualizar status:', error);
          this.carregarPedidos();
        }
      });
    }
  }

  verDetalhes(pedido: PedidoExibicao): void {
    this.pedidoSelecionado = pedido;
    console.log('Ver detalhes do pedido:', pedido);
  }

  filtrarPorStatus(status: string): void {
    if (status === '') {
      this.pedidosFiltrados = [...this.pedidos];
    } else {
      this.pedidosFiltrados = this.pedidos.filter(p => p.status === status);
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast = {
      show: true,
      message,
      type,
    };

    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }


}
