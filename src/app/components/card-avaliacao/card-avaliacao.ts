import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-avaliacao',
  imports: [],
  templateUrl: './card-avaliacao.html',
  styleUrl: './card-avaliacao.scss',
})
export class CardAvaliacao {

  // FAKE PARA O TESTE
@Input() avaliacao: any;


}
