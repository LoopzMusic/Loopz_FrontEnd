import { Component, OnInit, inject } from '@angular/core';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../../services/usuario/pedidos/pedido';
import { PedidoResumoAdminTodos } from '../../../shared/models/usuario/PedidosUsuarios'; 

interface PedidoExibicao extends PedidoResumoAdminTodos {
  numero: string;
  dataFormatada: string;
  totalItens: number;
  status: 'aguardando' | 'preparando' | 'enviado' | 'entregue';
}

@Component({
  selector: 'app-produto-vendido',
  imports: [CommonModule, Sidebar],
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
          dataFormatada: pedido.dtFinalizacao ? this.formatarData(pedido.dtFinalizacao) : 'Data não informada',
          totalItens: pedido.itens.length,
          status: 'entregue' as const 
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

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'aguardando': 'Aguardando',
      'preparando': 'Preparando',
      'enviado': 'Enviado',
      'entregue': 'Entregue'
    };
    return labels[status] || status;
  }

  getBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'aguardando': 'badge-warning',
      'preparando': 'badge-info',
      'enviado': 'badge-primary',
      'entregue': 'badge-success'
    };
    return classes[status] || 'badge-secondary';
  }

  alterarStatus(cdPedido: number, novoStatus: 'aguardando' | 'preparando' | 'enviado' | 'entregue'): void {
    const pedido = this.pedidos.find(p => p.cdPedido === cdPedido);
    if (pedido) {
      pedido.status = novoStatus;
      
     
      this.pedidoService.atualizarStatusPedido(cdPedido, novoStatus).subscribe({
        next: (response) => {
          console.log('Status atualizado com sucesso!', response);
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
}