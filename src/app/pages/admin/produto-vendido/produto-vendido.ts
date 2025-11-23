import { Component } from '@angular/core';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Produto {
  nome: string;
  quantidade: number;
  preco: number;
}

interface Pedido {
  id: number;
  numero: string;
  cliente: string;
  data: string;
  itens: number;
  valor: number;
  status: 'aguardando' | 'preparando' | 'enviado' | 'entregue';
  produtos: Produto[];  
}

@Component({
  selector: 'app-produto-vendido',
  imports: [CommonModule, Sidebar],
  templateUrl: './produto-vendido.html',
  styleUrl: './produto-vendido.scss',
})
export class ProdutoVendido {
  pedidos: Pedido[] = [
    {
      id: 1,
      numero: '001',
      cliente: 'João Silva',
      data: '14/01/2024',
      itens: 1,
      valor: 899.90,
      status: 'entregue',
      produtos: [  
        {
          nome: 'Violão Clássico Loopz Pro',
          quantidade: 1,
          preco: 899.90
        }
      ]
    },
    {
      id: 2,
      numero: '002',
      cliente: 'Maria Santos',
      data: '19/01/2024',
      itens: 1,
      valor: 2499.90,
      status: 'enviado',
      produtos: [  
        {
          nome: 'Guitarra Elétrica Stratocaster',
          quantidade: 1,
          preco: 2499.90
        }
      ]
    },
    {
      id: 3,
      numero: '003',
      cliente: 'Pedro Costa',
      data: '21/01/2024',
      itens: 2,
      valor: 3299.90,
      status: 'preparando',
      produtos: [  
        {
          nome: 'Bateria Acústica Pearl',
          quantidade: 1,
          preco: 2499.90
        },
        {
          nome: 'Pedal de Sustain',
          quantidade: 1,
          preco: 800.00
        }
      ]
    }
  ];

  pedidosFiltrados: Pedido[] = [];
  pedidoSelecionado: Pedido | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.pedidosFiltrados = [...this.pedidos];
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

  alterarStatus(pedidoId: number, novoStatus: 'aguardando' | 'preparando' | 'enviado' | 'entregue'): void {
    const pedido = this.pedidos.find(p => p.id === pedidoId);
    if (pedido) {
      pedido.status = novoStatus;
      console.log(`Status do pedido #${pedido.numero} alterado para: ${novoStatus}`);
      
      // Aqui você deve chamar seu serviço para atualizar o status no backend
      // Exemplo:
      // this.pedidoService.atualizarStatus(pedidoId, novoStatus).subscribe({
      //   next: (response) => {
      //     console.log('Status atualizado com sucesso!', response);
      //   },
      //   error: (error) => {
      //     console.error('Erro ao atualizar status:', error);
      //   }
      // });
    }
  }

  verDetalhes(pedido: Pedido): void {  // <-- CORRETO
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
