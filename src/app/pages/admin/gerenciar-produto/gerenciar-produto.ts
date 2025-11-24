import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';

interface Produto {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  estoque: number;
  categoria: string;
}

@Component({
  selector: 'app-gerenciar-produto',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './gerenciar-produto.html',
  styleUrls: ['./gerenciar-produto.scss']
})
export class GerenciarProduto implements OnInit {
  produtos: Produto[] = [
    {
      id: 1,
      nome: 'Violão Clássico Loopz Pro',
      marca: 'Loopz',
      preco: 899.90,
      estoque: 15,
      categoria: 'Cordas'
    },
    {
      id: 2,
      nome: 'Teclado Digital Premium 88 Teclas',
      marca: 'Yamaha',
      preco: 2499.90,
      estoque: 8,
      categoria: 'Teclas'
    },
    {
      id: 3,
      nome: 'Bateria Acústica Completa 5 Peças',
      marca: 'Pearl',
      preco: 3299.90,
      estoque: 3,
      categoria: 'Percussão'
    },
    {
      id: 4,
      nome: 'Violão Clássico Estudante',
      marca: 'Giannini',
      preco: 399.90,
      estoque: 25,
      categoria: 'Cordas'
    },
    {
      id: 5,
      nome: 'Guitarra Elétrica Stratocaster',
      marca: 'Fender',
      preco: 4599.90,
      estoque: 5,
      categoria: 'Cordas'
    },
    {
      id: 6,
      nome: 'Saxofone Alto Profissional',
      marca: 'Yamaha',
      preco: 5899.90,
      estoque: 2,
      categoria: 'Sopro'
    },
    {
      id: 7,
      nome: 'Baixo Elétrico 4 Cordas',
      marca: 'Ibanez',
      preco: 2199.90,
      estoque: 0,
      categoria: 'Cordas'
    }
  ];

  produtoParaExcluir: Produto | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicialização
  }

  getEstoqueStatus(estoque: number): string {
    if (estoque === 0) return 'Esgotado';
    if (estoque <= 10) return 'Baixo';
    return 'OK';
  }

  editarProduto(produtoId: number): void {
    console.log('Editando produto:', produtoId);
    // Navega para a página de cadastro com o ID do produto para edição
    this.router.navigate(['/admin/produtos/cadastrar'], { 
      queryParams: { id: produtoId } 
    });
  }

  confirmarExclusao(produto: Produto): void {
    this.produtoParaExcluir = produto;
    
    // Abre o modal usando Bootstrap
    const modalElement = document.getElementById('modalExcluir');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  excluirProduto(): void {
    if (this.produtoParaExcluir) {
      const index = this.produtos.findIndex(p => p.id === this.produtoParaExcluir!.id);
      
      if (index !== -1) {
        this.produtos.splice(index, 1);
        console.log('Produto excluído:', this.produtoParaExcluir.nome);
        
        // Aqui você deve chamar seu serviço para excluir do backend
        // Exemplo:
        // this.produtoService.excluir(this.produtoParaExcluir.id).subscribe({
        //   next: () => {
        //     console.log('Produto excluído com sucesso!');
        //   },
        //   error: (error) => {
        //     console.error('Erro ao excluir produto:', error);
        //   }
        // });
      }
      
      this.produtoParaExcluir = null;
    }
  }
}