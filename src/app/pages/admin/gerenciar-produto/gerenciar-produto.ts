import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { ProdutoService } from '../../../services/produto-service';
import { Produto } from '../../../shared/models/Produto';
import { forkJoin } from 'rxjs';
import { ShowToast } from '../../../components/show-toast/show-toast';

@Component({
  selector: 'app-gerenciar-produto',
  standalone: true,
  imports: [CommonModule, Sidebar, FormsModule, ShowToast],
  templateUrl: './gerenciar-produto.html',
  styleUrls: ['./gerenciar-produto.scss'],
})
export class GerenciarProduto implements OnInit {
  @ViewChild('toastProduto') toastProduto!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  produtos: Produto[] = [];
  produtoParaExcluir: Produto | null = null;
  produtoParaEditar: Produto | null = null;
  cdEstoqueAtual: number | null = null;
  imagemSelecionada: File | null = null;
  imagemPreview: string | null = null;
  salvandoEdicao = false;
  filtroNome: string = "";
  filtroCategoria: string = "";
  categorias: string[] = [];
  produtosFiltrados: Produto[] = [];


  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  };

  constructor(private router: Router, private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
  this.produtoService.listarProdutos().subscribe({
    next: (data) => {
      this.produtos = data;

      
      this.categorias = [...new Set(data.map(p => p.dsCategoria))];

      
      this.produtosFiltrados = data;
    },
    error: (err) => {
      console.error('Erro ao listar produtos:', err);
      this.showToast('Erro ao carregar produtos!', 'error');
    },
  });
}


  getEstoqueStatus(estoque: number): string {
    if (estoque === 0) return 'Esgotado';
    if (estoque <= 10) return 'Baixo';
    return 'OK';
  }

  abrirModalEditar(produto: Produto): void {
    this.produtoParaEditar = { ...produto };

    this.imagemSelecionada = null;
    this.imagemPreview = null;

    this.cdEstoqueAtual = produto.cdProduto;
    console.log('cdEstoqueAtual:', this.cdEstoqueAtual);

    const modalElement = document.getElementById('modalEditar');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onImagemSelecionada(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagemPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  salvarEdicao(): void {
    if (!this.produtoParaEditar) return;

    this.salvandoEdicao = true;

    const dadosTexto = {
      nmProduto: this.produtoParaEditar.nmProduto,
      vlProduto: this.produtoParaEditar.vlProduto,
      dsProduto: this.produtoParaEditar.dsProduto,
      dsCategoria: this.produtoParaEditar.dsCategoria,
      dsAcessorio: this.produtoParaEditar.dsAcessorio,
      cdEmpresa: this.produtoParaEditar.cdEmpresa,
    };

    const requests = [];

    requests.push(
      this.produtoService.atualizarTextoProduto(this.produtoParaEditar.cdProduto, dadosTexto)
    );

    const dadosEstoque = {
      qtdEstoqueProduto: this.produtoParaEditar.qtdEstoqueProduto,
      cdProduto: this.produtoParaEditar.cdProduto,
    };

    requests.push(
      this.produtoService.atualizarEstoque(this.produtoParaEditar.cdProduto, dadosEstoque)
    );

    if (this.imagemSelecionada) {
      requests.push(
        this.produtoService.atualizarImagemProduto(
          this.produtoParaEditar.cdProduto,
          this.imagemSelecionada
        )
      );
    }

    forkJoin(requests).subscribe({
      next: () => {
        this.finalizarEdicao(true);
      },
      error: (err) => {
        console.error('Erro ao atualizar produto:', err);
        this.showToast('Erro ao atualizar produto!', 'error');
        this.salvandoEdicao = false;
      },
    });
  }

  finalizarEdicao(sucesso: boolean): void {
    this.salvandoEdicao = false;

    if (sucesso) {
      this.showToast('Produto atualizado com sucesso!', 'success');

      const modalElement = document.getElementById('modalEditar');
      if (modalElement) {
        const bootstrap = (window as any).bootstrap;
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }

      this.carregarProdutos();
    }

    this.produtoParaEditar = null;
    this.cdEstoqueAtual = null;
    this.imagemSelecionada = null;
    this.imagemPreview = null;
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
        this.produtos = this.produtos.filter((p) => p.cdProduto !== id);
        this.showToast('Produto excluído com sucesso!', 'success');
      },
      error: (err) => {
        console.error('Erro ao excluir produto:', err);
        this.showToast('Erro ao excluir produto!', 'error');
      },
    });

    this.produtoParaExcluir = null;
  }

  filtrarProdutos() {
  this.produtosFiltrados = this.produtos.filter(p => {
    const nomeOk = p.nmProduto.toLowerCase().includes(this.filtroNome.toLowerCase());
    const categoriaOk = this.filtroCategoria ? p.dsCategoria === this.filtroCategoria : true;
    return nomeOk && categoriaOk;
  });
}
  getLabelCategoriaFiltro(): string {
  return this.filtroCategoria === '' ? 'Todas as categorias' : this.filtroCategoria;
}

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast = {
      show: true,
      message,
      type,
    };

    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }
}
