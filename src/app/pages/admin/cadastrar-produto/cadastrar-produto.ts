import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { Router } from '@angular/router';
import { ProdutoCadastro } from '../../../shared/models/Produto-cadastro';
import { EstoqueCadastroProduto } from '../../../shared/models/Estoque-cadastro-produto';
import { ProdutoService } from '../../../services/produto-service';
import { EmpresaService } from '../../../services/empresa-service';
import { Empresa } from '../../../shared/models/Empresa';

@Component({
  selector: 'app-cadastrar-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  templateUrl: './cadastrar-produto.html',
  styleUrl: './cadastrar-produto.scss',
})
export class CadastrarProduto {

  produtoForm!: FormGroup;
  imagemSelecionada: string = '';
  arquivoImagem!: File | null;
  loading: boolean = false;
  isEdicao: boolean = false;
  empresas: any[] = [];

  
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private produtoService: ProdutoService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarEmpresas();
  }

  carregarEmpresas() {
    this.empresaService.listarEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
      },
      error: (err) => {
        console.error('Erro ao carregar empresas:', err);
        this.mostrarToast('Erro ao carregar empresas', 'error');
      }
    });
  }

  
  mostrarToast(mensagem: string, tipo: 'success' | 'error' = 'success') {
    this.toastMessage = mensagem;
    this.toastType = tipo;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  
  fecharToast() {
    this.showToast = false;
  }

  initForm(): void {
    this.produtoForm = this.formBuilder.group({
      nmProduto: ['', Validators.required],
      vlProduto: ['', [Validators.required, Validators.min(0)]],
      dsCategoria: ['', Validators.required],
      dsAcessorio: ['', Validators.required],
      dsProduto: ['', Validators.required],
      cdEmpresa: ['', Validators.required],
      qtdEstoqueProduto: ['', [Validators.required, Validators.min(1)]],
      imgProduto: [''] 
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.produtoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.arquivoImagem = file;
      this.imagemSelecionada = file.name;
      this.produtoForm.patchValue({ imgProduto: file.name });
      this.mostrarToast('Imagem selecionada com sucesso!', 'success');
    } else {
      this.imagemSelecionada = '';
      this.arquivoImagem = null;
    }
  }

  onSubmit(): void {
    if (this.produtoForm.invalid) {
      Object.keys(this.produtoForm.controls).forEach(key => {
        this.produtoForm.get(key)?.markAsTouched();
      });
      this.mostrarToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    this.loading = true;

    const formData = new FormData();

    formData.append('nmProduto', this.produtoForm.value.nmProduto);
    formData.append('vlProduto', this.produtoForm.value.vlProduto);
    formData.append('dsCategoria', this.produtoForm.value.dsCategoria);
    formData.append('dsAcessorio', this.produtoForm.value.dsAcessorio);
    formData.append('dsProduto', this.produtoForm.value.dsProduto);
    formData.append('cdEmpresa', this.produtoForm.value.cdEmpresa);

    if (this.arquivoImagem) {
      formData.append('imgProduto', this.arquivoImagem);
    }

    this.produtoService.cadastrarProduto(formData).subscribe({
      next: (response) => {
        const cdProdutoCriado = response.cdProduto;
        const quantidade = this.produtoForm.value.qtdEstoqueProduto;

        const estoque: EstoqueCadastroProduto = {
          cdProduto: cdProdutoCriado,
          qtdEstoqueProduto: quantidade
        };

        this.produtoService.criarEstoque(estoque).subscribe({
          next: () => {
            this.mostrarToast('Produto e estoque cadastrados com sucesso!', 'success');
            this.loading = false;
            
            setTimeout(() => {
              this.router.navigate(['/admin/produtos']);
            }, 2000);
          },
          error: (err) => {
            console.error('Erro ao criar estoque:', err);
            this.mostrarToast('Erro ao criar o estoque', 'error');
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Erro ao cadastrar produto:', err);
        this.mostrarToast('Erro ao cadastrar o produto', 'error');
        this.loading = false;
      }
    });
  }

  onCancelar(): void {
    if (confirm('Deseja realmente cancelar?')) {
      this.router.navigate(['/admin/produtos']);
    }
  }
}