import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})
export class Cadastro {
  cadastroForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.cadastroForm = this.fb.group({
      nmCliente: ['', [Validators.required, Validators.minLength(3)]],
      dsEmail: ['', [Validators.required, Validators.email]],
      nuTelefone: ['', [Validators.required, Validators.minLength(14)]],
      nuCPF: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      dsEstado: ['', [Validators.required]],
      dsCidade: ['', [Validators.required]],
      dsEndereco: ['', [Validators.required]],
      nuEndereco: ['', [Validators.required]],
      dsSenha: ['', [Validators.required, Validators.minLength(8)]],
      confirmaSenha: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const senha = form.get('dsSenha');
    const confirmaSenha = form.get('confirmaSenha');
    
    if (senha && confirmaSenha && senha.value !== confirmaSenha.value) {
      confirmaSenha.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  formatCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    event.target.value = value;
    this.cadastroForm.patchValue({ nuCPF: value }, { emitEvent: false });
  }

  formatTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    
    event.target.value = value;
    this.cadastroForm.patchValue({ nuTelefone: value }, { emitEvent: false });
  }

  onSubmit() {
    if (this.cadastroForm.invalid) {
      this.markFormGroupTouched(this.cadastroForm);
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simula cadastro (remover quando implementar a API)
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Cadastro realizado com sucesso!';
      
      // Descomentar quando implementar navegação
      // setTimeout(() => this.navigateToLogin(), 2000);
    }, 2000);

    const { confirmaSenha, ...clienteData } = this.cadastroForm.value;
    console.log('Dados do cliente:', clienteData);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}