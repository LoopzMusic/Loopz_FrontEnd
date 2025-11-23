import { Component } from '@angular/core';
import { Card } from "../../components/card/card";

@Component({
  selector: 'app-favoritos',
  imports: [Card],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.scss',
})
export class Favoritos {
  favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

}
