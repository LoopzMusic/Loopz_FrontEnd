import { Routes } from '@angular/router';
import { Favoritos } from './pages/favoritos/favoritos';
import { Perfil } from './pages/perfil/perfil';
import { Carrinho } from './pages/carrinho/carrinho';
import { TelaInicial } from './pages/tela-inicial/tela-inicial';
import { Login } from './pages/login/login';
import { MaisDetalhes } from './pages/mais-detalhes/mais-detalhes';

export const routes: Routes = [
    { path: '', component: TelaInicial },
    { path: 'favoritos', component: Favoritos },
    { path: 'perfil', component: Perfil },
    { path: 'carrinho', component: Carrinho },
    { path: 'login', component: Login },
    { path: 'maisDetalhes', component: MaisDetalhes }
];
