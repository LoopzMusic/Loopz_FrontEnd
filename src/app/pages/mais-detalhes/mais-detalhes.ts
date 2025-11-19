import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-mais-detalhes',
  imports: [RouterLink],
  templateUrl: './mais-detalhes.html',
  styleUrl: './mais-detalhes.scss',
})
export class MaisDetalhes {
  // FAKE PARA O TESTE
@Input() data: any;
}
