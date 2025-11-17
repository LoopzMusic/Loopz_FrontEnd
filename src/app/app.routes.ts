import { Routes } from '@angular/router';
import { Favoritos } from './pages/favoritos/favoritos';
import { Perfil } from './pages/perfil/perfil';
import { Carrinho } from './pages/carrinho/carrinho';
import { Login } from './pages/login/login';

export const routes: Routes = [
    { path: 'favoritos', component: Favoritos },
    { path: 'perfil', component: Perfil },
    { path: 'carrinho', component: Carrinho },
    { path: 'login', component: Login }
];
