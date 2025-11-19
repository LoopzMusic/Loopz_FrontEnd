import { Component, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CardAvaliacao } from "../../components/card-avaliacao/card-avaliacao";

@Component({
  selector: 'app-mais-detalhes',
  imports: [RouterLink, CardAvaliacao],
  templateUrl: './mais-detalhes.html',
  styleUrl: './mais-detalhes.scss',
})
export class MaisDetalhes {

  // CRIANDO UMA AVALIAÇÃO FAKE PARA O TESTE
  avaliacaoFake = {
    usuario: 'Laura',
    descricao: 'Violão muito bom!',
    data: '03/07/2025',
    estrelas: '5.0'
  };

  @Input() data: any;

  private route = inject(ActivatedRoute);

  idProdutoFake = this.route.snapshot.params['id'];

  constructor() {}
  
}
