import { Component } from '@angular/core';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { CommonModule } from '@angular/common';

interface Avaliacao {
  id: number;
  produto: string;
  cliente: string;
  estrelas: number;
  comentario: string;
  data: string;
}

@Component({
  selector: 'app-avaliacoes',
  imports: [CommonModule, Sidebar],
  templateUrl: './avaliacoes.html',
  styleUrl: './avaliacoes.scss',
})
export class Avaliacoes {
  avaliacoes: Avaliacao[] = [
    {
      id: 1,
      produto: 'Violão Clássico Loopz Pro',
      cliente: 'Carlos Silva',
      estrelas: 5,
      comentario: 'Excelente qualidade de som! Perfeito para apresentações.',
      data: '14/01/2024'
    },
    {
      id: 2,
      produto: 'Violão Clássico Loopz Pro',
      cliente: 'Ana Paula',
      estrelas: 4,
      comentario: 'Muito bom, mas a entrega demorou um pouco.',
      data: '09/01/2024'
    },
    {
      id: 3,
      produto: 'Teclado Digital Premium',
      cliente: 'Ricardo Martins',
      estrelas: 5,
      comentario: 'Simplesmente perfeito! A sensibilidade das teclas é incrível.',
      data: '19/01/2024'
    },
    {
      id: 4,
      produto: 'Guitarra Elétrica Stratocaster',
      cliente: 'Maria Santos',
      estrelas: 5,
      comentario: 'Som impecável! Acabamento perfeito. Super recomendo!',
      data: '22/01/2024'
    },
    {
      id: 5,
      produto: 'Bateria Acústica Pearl',
      cliente: 'Pedro Costa',
      estrelas: 4,
      comentario: 'Ótima bateria, mas o prato poderia ser melhor.',
      data: '15/01/2024'
    },
    {
      id: 6,
      produto: 'Saxofone Alto Yamaha',
      cliente: 'Juliana Oliveira',
      estrelas: 5,
      comentario: 'Qualidade excepcional! O som é rico e profundo.',
      data: '11/01/2024'
    },
    {
      id: 7,
      produto: 'Violão Folk Takamine',
      cliente: 'Roberto Lima',
      estrelas: 3,
      comentario: 'Bom produto, mas esperava mais pelo preço.',
      data: '08/01/2024'
    },
    {
      id: 8,
      produto: 'Teclado Yamaha PSR-E373',
      cliente: 'Fernanda Souza',
      estrelas: 4,
      comentario: 'Muito bom para iniciantes! Fácil de usar.',
      data: '05/01/2024'
    },
    {
      id: 9,
      produto: 'Baixo Fender Jazz Bass',
      cliente: 'Marcelo Alves',
      estrelas: 5,
      comentario: 'Simplesmente o melhor baixo que já tive! Vale cada centavo.',
      data: '03/01/2024'
    },
    {
      id: 10,
      produto: 'Violão Clássico Loopz Pro',
      cliente: 'Carla Mendes',
      estrelas: 2,
      comentario: 'Veio com um pequeno defeito no acabamento.',
      data: '28/12/2023'
    }
  ];

  avaliacoesFiltradas: Avaliacao[] = [];
  filtroEstrelas: number = 0; 

  ngOnInit(): void {
    this.avaliacoesFiltradas = [...this.avaliacoes];
  }

  filtrarPorEstrelas(estrelas: number): void {
    this.filtroEstrelas = estrelas;
    
    if (estrelas === 0) {
      this.avaliacoesFiltradas = [...this.avaliacoes];
    } else {
      this.avaliacoesFiltradas = this.avaliacoes.filter(a => a.estrelas === estrelas);
    }
  }

  getFiltroLabel(): string {
    if (this.filtroEstrelas === 0) {
      return 'Todas as notas';
    }
    return `${this.filtroEstrelas} estrela${this.filtroEstrelas !== 1 ? 's' : ''}`;
  }
}
