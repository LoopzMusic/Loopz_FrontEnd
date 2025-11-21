import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importação essencial para navegação
import { Sidebar } from '../../../components/adm/sidebar/sidebar';

// Interfaces mantidas para clareza
interface StatsCard {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
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

  stats: StatsCard[] = [
    {
      title: 'Total de Produtos',
      value: 156,
      subtitle: '+12 este mês',
      icon: 'box-fill',
      color: '#2196F3',
    },
    {
      title: 'Pedidos Totais',
      value: 342,
      subtitle: '+23 esta semana',
      icon: 'cart-fill',
      color: '#4CAF50',
    },
    {
      title: 'Avaliações',
      value: 1234,
      subtitle: '4.7 média geral',
      icon: 'star-fill',
      color: '#FF9800',
    },
    {
      title: 'Estoque Baixo',
      value: 8,
      subtitle: 'Requer atenção',
      icon: 'exclamation-triangle-fill',
      color: '#F44336',
    },
  ];

  quickActions: QuickAction[] = [
    {
      title: 'Gerenciar Produtos',
      description: 'Visualizar, editar e excluir produtos',
      route: '/admin/gerenciar-produtos',
    },
    {
      title: 'Cadastrar Produto',
      description: 'Adicionar novo produto ao catálogo',
      route: '/admin/cadastrar-produtos',
    },
    {
      title: 'Produtos Vendidos',
      description: 'Visualizar pedidos e atualizar status',
      route: '/admin/vendidos',
    },
    {
      title: 'Avaliações',
      description: 'Ver avaliações dos clientes',
      route: '/admin/avaliacoes',
    },
    {
      title: 'Estoque Baixo',
      description: 'Produtos com estoque crítico',
      route: '/admin/estoque-baixo',
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
      title: 'Estoque baixo',
      description: 'Galeria Acústica - 3 unidades',
      time: 'Há 2 horas',
      color: '#FF9800',
    },
    {
      title: 'Nova avaliação',
      description: '5 estrelas - Violão Clássico',
      time: 'Há 3 horas',
      color: '#9C27B0',
    },
  ];

  ngOnInit(): void {
    // Inicialização
  }

  navigateTo(route: string, item: string): void {
    this.router.navigate([route]);
  }
}
