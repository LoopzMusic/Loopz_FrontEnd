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
import { Filtro } from './components/filtro/filtro';
import { GerenciarProduto } from './pages/admin/gerenciar-produto/gerenciar-produto';

  export const routes: Routes = [
    { path: '', component: TelaInicial },
    { path: 'favoritos', component: Favoritos },
    { path: 'perfil', component: Perfil },
    { path: 'carrinho', component: Carrinho },
    { path: 'filtro/:categoria', component: Filtro },
    { path: 'login', component: Login },
    { path: 'cadastro', component: Cadastro },
    { path: 'maisDetalhes/:id', component: MaisDetalhes },
    { path: 'admin/dashboard', component: Dashboard },
    { path: 'admin/cadastrar-produto', component: CadastrarProduto },
    { path: 'admin/produto-vendido', component: ProdutoVendido },
    { path: 'admin/avaliacoes', component: Avaliacoes },
    { path: 'admin/gerenciar-produto', component: GerenciarProduto }
    
  ];
