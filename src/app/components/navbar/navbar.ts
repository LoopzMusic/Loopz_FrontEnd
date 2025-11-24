import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

mudarTema() {
  const html = document.documentElement;

  const temaAtual = html.getAttribute('data-bs-theme');

  if (temaAtual === 'dark') {
    html.setAttribute('data-bs-theme', 'light');
  } else {
    html.setAttribute('data-bs-theme', 'dark');
  }
}

}
