import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { ProdutoService } from '../../../services/produto-service';
import { Produto } from '../../../shared/models/Produto';

@Component({
  selector: 'app-gerenciar-produto',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './gerenciar-produto.html',
  styleUrls: ['./gerenciar-produto.scss']
})
export class GerenciarProduto implements OnInit {

  produtos: Produto[] = [];
  produtoParaExcluir: Produto | null = null;

  constructor(
    private router: Router,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listarProdutos().subscribe({
      next: (data) => {
        this.produtos = data;
      },
      error: (err) => {
        console.error('Erro ao listar produtos:', err);
      }
    });
  }

  getEstoqueStatus(estoque: number): string {
    if (estoque === 0) return 'Esgotado';
    if (estoque <= 10) return 'Baixo';
    return 'OK';
  }

  editarProduto(produtoId: number): void {
    this.router.navigate(['/admin/produtos/cadastrar'], { 
      queryParams: { id: produtoId } 
    });
  }

  confirmarExclusao(produto: Produto): void {
    this.produtoParaExcluir = produto;

    const modalElement = document.getElementById('modalExcluir');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  excluirProduto(): void {
    if (!this.produtoParaExcluir) return;

    const id = this.produtoParaExcluir.cdProduto; 

    this.produtoService.excluirProduto(id).subscribe({
      next: () => {
        this.produtos = this.produtos.filter(p => p.cdProduto !== id);
      },
      error: (err) => {
        console.error('Erro ao excluir produto:', err);
        alert('Erro ao excluir o produto');
      }
    });

    this.produtoParaExcluir = null;
  }
}
