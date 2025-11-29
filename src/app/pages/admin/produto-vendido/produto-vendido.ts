import { Component, OnInit, inject } from '@angular/core';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../../services/usuario/pedidos/pedido';
import { PedidoResumoAdminTodos } from '../../../shared/models/usuario/PedidosUsuarios';
import { ShowToast } from '../../../components/show-toast/show-toast';
import { FormsModule } from '@angular/forms';

type StatusPedido = 'ABERTO' | 'ANDAMENTO' | 'FINALIZADO';

interface PedidoExibicao extends PedidoResumoAdminTodos {
  numero: string;
  dataFormatada: string;
  totalItens: number;
  status: StatusPedido;
}

@Component({
  selector: 'app-produto-vendido',
  imports: [CommonModule, Sidebar, ShowToast, FormsModule],
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

  filtroNomeCliente: string = '';
  filtroData: string = '';
  filtroStatus: string = '';

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.carregando = true;

    this.pedidoService.listarTodosPedidosAdmin().subscribe({
      next: (data) => {
        console.log('Pedidos recebidos:', data);

        this.pedidos = data.map((pedido) => ({
          ...pedido,
          numero: String(pedido.cdPedido).padStart(3, '0'),
          dataFormatada: pedido.dtFinalizacao
            ? this.formatarData(pedido.dtFinalizacao)
            : 'Sem data',
          totalItens: pedido.itens.length,
          status: pedido.statusPedido as StatusPedido,
        }));

        this.pedidosFiltrados = [...this.pedidos];
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
        this.carregando = false;
      },
    });
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  getStatusLabel(status: StatusPedido): string {
    const labels: Record<StatusPedido, string> = {
      ABERTO: 'Aguardando Pagamento',
      ANDAMENTO: 'Em Andamento',
      FINALIZADO: 'Finalizado',
    };
    return labels[status];
  }

  getBadgeClass(status: StatusPedido): string {
    const classes: Record<StatusPedido, string> = {
      ABERTO: 'badge-warning',
      ANDAMENTO: 'badge-info',
      FINALIZADO: 'badge-success',
    };
    return classes[status];
  }

  alterarStatus(cdPedido: number, novoStatus: StatusPedido): void {
  const pedido = this.pedidos.find((p) => p.cdPedido === cdPedido);
  if (pedido) {
    pedido.status = novoStatus;

    this.pedidoService.atualizarStatusPedido(cdPedido).subscribe({
      next: () => {
        console.log('Status atualizado com sucesso!');
        this.filtrarPedidos();
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
        pedido.status = this.pedidos.find(p => p.cdPedido === cdPedido)?.status ?? pedido.status;
      },
    });
  }
}

filtrarPorStatus(status: StatusPedido | '') {
  this.filtroStatus = status;
  this.filtrarPedidos();
}


  verDetalhes(pedido: PedidoExibicao): void {
    this.pedidoSelecionado = pedido;
    console.log('Ver detalhes do pedido:', pedido);
  }

  filtrarPedidos(): void {
    this.pedidosFiltrados = this.pedidos.filter((pedido) => {
      const filtroStatusOk = this.filtroStatus === '' || pedido.status === this.filtroStatus;

      const filtroNomeOk =
        this.filtroNomeCliente.trim() === '' ||
        pedido.nmCliente.toLowerCase().includes(this.filtroNomeCliente.toLowerCase());

      const filtroDataOk =
        this.filtroData === '' || pedido.dataFormatada === this.formatarData(this.filtroData);

      return filtroStatusOk && filtroNomeOk && filtroDataOk;
    });
  }

  trackByPedido(index: number, pedido: PedidoExibicao): number {
    return pedido.cdPedido;
  }
  
  getLabelStatusFiltro(): string {
  if (this.filtroStatus === '') {
    return 'Filtrar por Status';
  }
  return this.getStatusLabel(this.filtroStatus as StatusPedido);
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
