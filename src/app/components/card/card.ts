import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Produto } from '../../shared/models/Produto';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {

 @Input({ required: true }) produto: Produto = new Produto();

}
