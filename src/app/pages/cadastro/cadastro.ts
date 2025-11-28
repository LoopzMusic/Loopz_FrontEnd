import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Viacep } from '../../services/viacep';
import { HttpClient } from '@angular/common/http';
import { CpfValidator } from '../../validators/cpfValidator';
import { AuthService } from '../../services/auth-service';

export interface UsuarioCadastro {
  nmCliente: string;
  dsEmail: string;
  dsSenha: string;
  nuCPF: string;
  nuTelefone: string;
  dsCidade: string;
  dsEstado: string;
  dsEndereco: string;
  nuEndereco: string;
}

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
  isLoading = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private viaCep: Viacep,
    private authService: AuthService
  ) {
    this.cadastroForm = this.fb.group(
      {
        nmCliente: ['', [Validators.required, Validators.minLength(3)]],
        dsEmail: ['', [Validators.required, Validators.email]],
        nuTelefone: ['', [Validators.required]],
        nuCPF: ['', [Validators.required, Validators.minLength(14), this.cpfValidator]], // ADICIONA O VALIDADOR CUSTOMIZADO
        nuCEP: ['', [Validators.required]],
        dsEstado: ['', [Validators.required]],
        dsCidade: ['', [Validators.required]],
        dsEndereco: ['', [Validators.required]],
        nuEndereco: ['', [Validators.required]],
        dsSenha: ['', [Validators.required, Validators.minLength(8)]],
        confirmaSenha: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // VALIDADOR CUSTOMIZADO PARA CPF
  cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    
    if (!cpf) {
      return null; // Se vazio, deixa o Validators.required cuidar
    }
    
    if (!CpfValidator.validarCPF(cpf)) {
      return { cpfInvalido: true };
    }
    
    return null;
  }

  passwordMatchValidator(form: FormGroup) {
    const senha = form.get('dsSenha')?.value;
    const confirma = form.get('confirmaSenha')?.value;
    if (senha !== confirma) {
      form.get('confirmaSenha')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
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

  formatCEP(event: any) {
    let v = event.target.value.replace(/\D/g, '');
    if (v.length > 5) v = v.replace(/(\d{5})(\d)/, '$1-$2');
    event.target.value = v;
    this.cadastroForm.patchValue({ nuCEP: v });
  }

  buscarCEP() {
    const cep = this.cadastroForm.value.nuCEP.replace(/\D/g, '');

    if (cep.length !== 8) {
      this.cadastroForm.get('nuCEP')?.markAsTouched();
      this.mostrarToast('CEP deve ter 8 dígitos', 'error');
      return;
    }

    this.viaCep.buscarCEP(cep).subscribe({
      next: (data) => {
        if (!data.erro) {
          this.cadastroForm.patchValue({
            dsEstado: data.uf,
            dsCidade: data.localidade,
            dsEndereco: data.logradouro
          });
          this.mostrarToast('CEP encontrado!', 'success');
        } else {
          this.mostrarToast('CEP não encontrado', 'error');
        }
      },
      error: () => {
        this.mostrarToast('Erro ao buscar CEP', 'error');
      }
    });
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
    let v = event.target.value.replace(/\D/g, '');

    if (v.length > 11) {
      v = v.substring(0, 11);
    }

    if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d)(\d{4})$/, '$1-$2');
    } else if (v.length > 0) {
      v = v.replace(/^(\d{1,2})/, '($1');
    }

    event.target.value = v;
    this.cadastroForm.patchValue({ nuTelefone: v }, { emitEvent: false });
  }

  onSubmit() {
    if (this.cadastroForm.invalid) {
      this.markFormGroupTouched(this.cadastroForm);
      this.mostrarToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    this.isLoading = true;

    const { confirmaSenha, nuCEP, ...data } = this.cadastroForm.value;

    const usuarioCadastro: UsuarioCadastro = {
      nmCliente: data.nmCliente,
      dsEmail: data.dsEmail,
      dsSenha: data.dsSenha,
      nuCPF: data.nuCPF.replace(/\D/g, ''),
      nuTelefone: data.nuTelefone.replace(/\D/g, ''),
      dsCidade: data.dsCidade,
      dsEstado: data.dsEstado,
      dsEndereco: data.dsEndereco,
      nuEndereco: data.nuEndereco
    };

    console.log("Enviando:", usuarioCadastro);

    this.authService.cadastrar(usuarioCadastro).subscribe({
      next: () => {
        this.isLoading = false;
        this.mostrarToast("Cadastro realizado com sucesso!", "success");

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        const erro = err.error?.message || "Erro ao cadastrar";
        this.mostrarToast(erro, "error");
      }
    });
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