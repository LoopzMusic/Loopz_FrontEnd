import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from "../../components/card/card";

@Component({
  selector: 'app-tela-inicial',
  imports: [RouterLink, Card],
  templateUrl: './tela-inicial.html',
  styleUrl: './tela-inicial.scss',
})
export class TelaInicial {

  // CRIANDO UM PRODUTO FAKE PARA O TESTE
produtoFake = {
  title: 'Violão Clássico Loopz Pro',
  image: 'violaoloopz.webp',
  category: 'Loopz',
  rating: 4.8,
  stock: 15,
  price: '899.90'
};

}
