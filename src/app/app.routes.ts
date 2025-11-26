import { Routes } from '@angular/router';
import { Favoritos } from './pages/favoritos/favoritos';
import { Perfil } from './pages/perfil/perfil';
import { Carrinho } from './pages/carrinho/carrinho';
import { TelaInicial } from './pages/tela-inicial/tela-inicial';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { MaisDetalhes } from './pages/mais-detalhes/mais-detalhes';
import { Dashboard } from '././pages/admin/dashboard/dashboard';
import { CadastrarProduto } from './pages/admin/cadastrar-produto/cadastrar-produto';
import { ProdutoVendido } from './pages/admin/produto-vendido/produto-vendido';
import { Avaliacoes } from './pages/admin/avaliacoes/avaliacoes';
import { GerenciarProduto } from './pages/admin/gerenciar-produto/gerenciar-produto';
import { Todos } from './components/filtros/todos/todos';
import { Cordas } from './components/filtros/cordas/cordas';
import { Percussao } from './components/filtros/percussao/percussao';
import { Teclas } from './components/filtros/teclas/teclas';
import { Acessorios } from './components/filtros/acessorios/acessorios';
import { Sopro } from './components/filtros/sopro/sopro';
import { FinalizarCompra } from './pages/finalizar-compra/finalizar-compra';
import { perfilGuardGuard } from './guards/perfil-guard-guard';

export const routes: Routes = [
  { path: '', component: TelaInicial },
  { path: 'favoritos', component: Favoritos },
  { path: 'perfil', component: Perfil },
  { path: 'carrinho', component: Carrinho },
  { path: 'filtro/todos', component: Todos },
  { path: 'filtro/cordas', component: Cordas },
  { path: 'filtro/percussao', component: Percussao },
  { path: 'filtro/teclas', component: Teclas },
  { path: 'filtro/sopro', component: Sopro },
  { path: 'filtro/acessorios', component: Acessorios },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'maisDetalhes/:id', component: MaisDetalhes },
  { path: 'admin/dashboard', component: Dashboard, canActivate: [perfilGuardGuard] },
  { path: 'admin/cadastrar-produto', component: CadastrarProduto, canActivate: [perfilGuardGuard] },
  { path: 'admin/produto-vendido', component: ProdutoVendido, canActivate: [perfilGuardGuard] },
  { path: 'admin/avaliacoes', component: Avaliacoes, canActivate: [perfilGuardGuard] },
  { path: 'admin/gerenciar-produto', component: GerenciarProduto, canActivate: [perfilGuardGuard] },
  {
    path: 'carrinho',
    loadComponent: () => import('./pages/carrinho/carrinho')
      .then(m => m.Carrinho)
  },
  {
    path: 'finalizar-compra',
    loadComponent: () => import('./pages/finalizar-compra/finalizar-compra')
      .then(m => m.FinalizarCompra)
  }
];
