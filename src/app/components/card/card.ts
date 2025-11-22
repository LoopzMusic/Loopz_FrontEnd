import { Component, Input } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Produto } from '../../shared/models/Produto';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {

   @Input({ required: true }) produto: Produto = new Produto();

  constructor(private router: Router) {}

  adicionarFavorito() {
    // pegar favoritos existentes
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

    // adicionar o novo produto
    favoritos.push(this.produto);

    // salvar de volta
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }

}
