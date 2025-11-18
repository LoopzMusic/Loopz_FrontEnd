import { Routes } from '@angular/router';
import { Favoritos } from './pages/favoritos/favoritos';
import { Perfil } from './pages/perfil/perfil';
import { Carrinho } from './pages/carrinho/carrinho';
import { TelaInicial } from './pages/tela-inicial/tela-inicial';

export const routes: Routes = [
    { path: '', component: TelaInicial },
    { path: 'favoritos', component: Favoritos },
    { path: 'perfil', component: Perfil },
    { path: 'carrinho', component: Carrinho },
];
