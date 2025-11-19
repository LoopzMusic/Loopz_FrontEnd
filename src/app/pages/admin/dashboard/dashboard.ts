import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importação essencial para navegação

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
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  // Simulação de injeção do Router
  private router = inject(Router);
  
  // Estado para controlar o item ativo na sidebar
  activeItem: string = 'dashboard';

  stats: StatsCard[] = [
    {
      title: 'Total de Produtos',
      value: 156,
      subtitle: '+12 este mês',
      icon: 'box-fill', // Ícone Bootstrap
      color: '#2196F3' // Azul
    },
    {
      title: 'Pedidos Totais',
      value: 342,
      subtitle: '+23 esta semana',
      icon: 'cart-fill', // Ícone Bootstrap
      color: '#4CAF50' // Verde
    },
    {
      title: 'Avaliações',
      value: 1234,
      subtitle: '4.7 média geral',
      icon: 'star-fill', // Ícone Bootstrap
      color: '#FF9800' // Laranja
    },
    {
      title: 'Estoque Baixo',
      value: 8,
      subtitle: 'Requer atenção',
      icon: 'exclamation-triangle-fill', // Ícone Bootstrap
      color: '#F44336' // Vermelho
    }
  ];

  quickActions: QuickAction[] = [
    {
      title: 'Gerenciar Produtos',
      description: 'Visualizar, editar e excluir produtos',
      route: '/admin/produtos'
    },
    {
      title: 'Cadastrar Produto',
      description: 'Adicionar novo produto ao catálogo',
      route: '/admin/produtos/cadastrar'
    },
    {
      title: 'Produtos Vendidos',
      description: 'Visualizar pedidos e atualizar status',
      route: '/admin/vendidos'
    },
    {
      title: 'Avaliações',
      description: 'Ver avaliações dos clientes',
      route: '/admin/avaliacoes'
    },
    {
      title: 'Estoque Baixo',
      description: 'Produtos com estoque crítico',
      route: '/admin/estoque'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      title: 'Novo pedido recebido',
      description: 'Pedido #342 - R$ 899,90',
      time: 'Há 5 minutos',
      color: '#4CAF50'
    },
    {
      title: 'Produto atualizado',
      description: 'Violão Clássico Longo Pro',
      time: 'Há 1 hora',
      color: '#2196F3'
    },
    {
      title: 'Estoque baixo',
      description: 'Galeria Acústica - 3 unidades',
      time: 'Há 2 horas',
      color: '#FF9800'
    },
    {
      title: 'Nova avaliação',
      description: '5 estrelas - Violão Clássico',
      time: 'Há 3 horas',
      color: '#9C27B0'
    }
  ];

  ngOnInit(): void {
    // Você pode definir o item ativo inicial baseado na rota atual aqui
  }

  // Método para definir o item ativo e simular a navegação
  navigateTo(route: string, item: string): void {
    this.activeItem = item;
    // this.router.navigate([route]); // Descomente quando a rota for configurada
    console.log(`Simulando navegação para: ${route}`);
  }
}