import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { ResumoAdministrativoService } from '../../../services/administrativo/administrativo';

interface StatsCard {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
  alert?: boolean; 
}

interface QuickAction {
  title: string;
  description: string;
  route: string;
}

interface RecentActivity {
  title: string;
  description: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private resumoService = inject(ResumoAdministrativoService);

  stats: StatsCard[] = [];
  carregandoStats = true;

  quickActions: QuickAction[] = [
    {
      title: 'Gerenciar Produtos',
      description: 'Visualizar, editar e excluir produtos',
      route: '/admin/gerenciar-produto',
    },
    {
      title: 'Cadastrar Produto',
      description: 'Adicionar novo produto ao catálogo',
      route: '/admin/cadastrar-produto',
    },
    {
      title: 'Produtos Vendidos',
      description: 'Visualizar pedidos e atualizar status',
      route: '/admin/produto-vendido',
    },
    {
      title: 'Avaliações',
      description: 'Ver avaliações dos clientes',
      route: '/admin/avaliacoes',
    },
  ];

  recentActivities: RecentActivity[] = [
    {
      title: 'Novo pedido recebido',
      description: 'Pedido #342 - R$ 899,90',
      time: 'Há 5 minutos',
      color: '#4CAF50',
    },
    {
      title: 'Produto atualizado',
      description: 'Violão Clássico Longo Pro',
      time: 'Há 1 hora',
      color: '#2196F3',
    },
    {
      title: 'Nova avaliação',
      description: '5 estrelas - Violão Clássico',
      time: 'Há 3 horas',
      color: '#9C27B0',
    },
  ];

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo(): void {
  this.carregandoStats = true;

  this.resumoService.getResumoCompleto().subscribe({
    next: (resumo) => {
      console.log('Resumo carregado:', resumo);
      
      const pedidosRecentes = resumo.pedidosEmAndamento || 0;
      const temPedidosRecentes = pedidosRecentes > 0;
      
      this.stats = [
        {
          title: 'Total de Produtos',
          value: resumo.totalProdutos,
          subtitle: 'Produtos cadastrados',
          icon: 'box-fill',
          color: '#2196F3',
        },
        {
          title: 'Pedidos Totais',
          value: resumo.totalPedidos,
          subtitle: temPedidosRecentes 
            ? `${pedidosRecentes} pedido${pedidosRecentes > 1 ? 's' : ''} recentes, ${pedidosRecentes > 1 ? 'olhar auditoria' : ''}` 
            : 'Pedidos realizados',
          icon: 'cart-fill',
          color: temPedidosRecentes ? '#FF9800' : '#4CAF50',
          alert: temPedidosRecentes 
        },
        {
          title: 'Avaliações',
          value: resumo.totalFeedbacks,
          subtitle: 'Feedbacks recebidos',
          icon: 'star-fill',
          color: '#FF9800',
        },
      ];

      this.carregandoStats = false;
    },
    error: (error) => {
      console.error('Erro ao carregar resumo:', error);
      this.carregandoStats = false;
      
      this.stats = [
        {
          title: 'Total de Produtos',
          value: 0,
          subtitle: 'Erro ao carregar',
          icon: 'box-fill',
          color: '#2196F3',
        },
        {
          title: 'Pedidos Totais',
          value: 0,
          subtitle: 'Erro ao carregar',
          icon: 'cart-fill',
          color: '#4CAF50',
        },
        {
          title: 'Avaliações',
          value: 0,
          subtitle: 'Erro ao carregar',
          icon: 'star-fill',
          color: '#FF9800',
        },
      ];
    }
  });
}

  navigateTo(route: string, item: string): void {
    this.router.navigate([route]);
  }
}