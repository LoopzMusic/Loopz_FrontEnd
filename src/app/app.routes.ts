import { Routes } from '@angular/router';
import { Favoritos } from './pages/favoritos/favoritos';
import { Perfil } from './pages/perfil/perfil';
import { Carrinho } from './pages/carrinho/carrinho';

export const routes: Routes = [
    // { path: '', component: PaginaInicial },
    { path: 'favoritos', component: Favoritos },
    { path: 'perfil', component: Perfil },
    { path: 'carrinho', component: Carrinho },
];
