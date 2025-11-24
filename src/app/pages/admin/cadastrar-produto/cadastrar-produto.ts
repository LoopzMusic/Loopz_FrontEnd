import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sidebar } from '../../../components/adm/sidebar/sidebar';
import { Router } from '@angular/router';

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
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.produtoForm = this.formBuilder.group({
      nomeProduto: ['', [Validators.required]],
      preco: ['', [Validators.required, Validators.min(0)]],
      quantidadeEstoque: ['', [Validators.required, Validators.min(0)]],
      marca: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      material: [''],
      cor: [''],
      descricao: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.produtoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file.name;
      // Aqui você pode adicionar lógica para upload da imagem
      // Por exemplo, usando FileReader para preview ou enviar para um serviço
    } else {
      this.imagemSelecionada = '';
    }
  }

  onSubmit(): void {
    if (this.produtoForm.valid) {
      this.loading = true;
      
      const produto = this.produtoForm.value;
      console.log('Produto a ser cadastrado:', produto);

      // Aqui você deve chamar seu serviço para cadastrar o produto
      // Exemplo:
      // this.produtoService.cadastrarProduto(produto).subscribe({
      //   next: (response) => {
      //     console.log('Produto cadastrado com sucesso!', response);
      //     this.router.navigate(['/admin/produtos']);
      //   },
      //   error: (error) => {
      //     console.error('Erro ao cadastrar produto:', error);
      //     this.loading = false;
      //   }
      // });

      // Simulação de requisição
      setTimeout(() => {
        alert('Produto cadastrado com sucesso!');
        this.loading = false;
        this.router.navigate(['/admin/produtos']);
      }, 1500);
    } else {
      // Marca todos os campos como touched para exibir erros
      Object.keys(this.produtoForm.controls).forEach(key => {
        this.produtoForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancelar(): void {
    if (confirm('Deseja realmente cancelar? Todas as alterações serão perdidas.')) {
      this.router.navigate(['/admin/produtos']);
    }
  }
}
