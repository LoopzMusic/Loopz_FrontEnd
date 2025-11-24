import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../shared/models/Usuario';
import { Categoria } from '../categoria/categoria';
import { CATEGORIAS } from '../../shared/models/Categorias';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Categoria],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(public authService: AuthService, private router: Router) {}

  get usuario() {
    console.log(this.authService.getUsuarioLogado());
    return this.authService.getUsuarioLogado();
  }

  perfilItens = [
    { label: 'Meu Perfil', link: '/perfil' },
    { label: 'Meus Pedidos', link: '/pedidos' },
    { label: 'Sair', link: null },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  mudarTema() {
    const html = document.documentElement;

    const temaAtual = html.getAttribute('data-bs-theme');

    if (temaAtual === 'dark') {
      html.setAttribute('data-bs-theme', 'light');
    } else {
      html.setAttribute('data-bs-theme', 'dark');
    }
  }

  categorias = CATEGORIAS;
}
