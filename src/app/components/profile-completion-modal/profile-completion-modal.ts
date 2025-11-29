import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserProfileCompletion } from '../../shared/models/UserProfileCompletion';
import { ShowToast } from '../show-toast/show-toast';

@Component({
  selector: 'app-profile-completion-modal',
  standalone: true,
  templateUrl: 'profile-completion-modal.html',
  styleUrls: ['profile-completion-modal.scss'],
  imports: [ReactiveFormsModule, CommonModule, ShowToast],
})
export class ProfileCompletionModal implements OnInit {
  @Output() profileCompleted = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8085/usuario';

  profileForm!: FormGroup;
  isLoading = false;
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  };

  // Estados brasileiros
  estados = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      nmCliente: ['', [Validators.required, Validators.minLength(3)]],
      nuCPF: ['', [Validators.required, this.cpfValidator.bind(this)]],
      nuTelefone: ['', [Validators.required, Validators.minLength(10)]],
      dsEndereco: ['', [Validators.required, Validators.minLength(5)]],
      nuEndereco: ['', [Validators.required]],
      dsCidade: ['', [Validators.required, Validators.minLength(3)]],
      dsEstado: ['', [Validators.required]],
    });
  }

  /**
   * Validador customizado para CPF
   */
  private cpfValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }

    // Remove caracteres especiais
    const cpf = control.value.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
      return { invalidCpf: true };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { invalidCpf: true };
    }

    // Validação do primeiro dígito verificador
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10), 10)) {
      return { invalidCpf: true };
    }

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(10, 11), 10)) {
      return { invalidCpf: true };
    }

    return null;
  }

  /**
   * Formata o CPF enquanto o usuário digita
   */
  formatCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 6) {
      value =
        value.substring(0, 3) +
        '.' +
        value.substring(3, 6) +
        '.' +
        value.substring(6, 9) +
        '-' +
        value.substring(9);
    } else if (value.length > 3) {
      value = value.substring(0, 3) + '.' + value.substring(3);
    }

    this.profileForm.patchValue({ nuCPF: value }, { emitEvent: false });
  }

  /**
   * Formata o telefone enquanto o usuário digita
   */
  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 6) {
      value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7);
    } else if (value.length > 2) {
      value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
    }

    this.profileForm.patchValue({ nuTelefone: value }, { emitEvent: false });
  }

  /**
   * Submete o formulário de completude de perfil
   */
  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.showToast('Por favor, preencha todos os campos corretamente', 'error');
      return;
    }

    this.isLoading = true;
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      this.showToast('Erro: usuário não encontrado', 'error');
      this.isLoading = false;
      return;
    }

    const usuarioData = JSON.parse(usuario);
    const profileData: UserProfileCompletion = {
      cdUsuario: usuarioData.cdUsuario,
      ...this.profileForm.value,
    };

    // Remove formatação do CPF e telefone
    profileData.nuCPF = profileData.nuCPF.replace(/\D/g, '');
    profileData.nuTelefone = profileData.nuTelefone.replace(/\D/g, '');

    this.http.put(`${this.baseUrl}/${usuarioData.cdUsuario}/perfil`, profileData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.showToast('Perfil atualizado com sucesso!', 'success');

        // Atualiza o usuário no localStorage
        const usuarioAtualizado = {
          ...usuarioData,
          ...profileData,
          profileComplete: true,
        };
        localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));

        // Emite evento de conclusão
        setTimeout(() => {
          this.profileCompleted.emit();
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao atualizar perfil:', error);
        const errorMessage = error.error?.message || 'Erro ao atualizar perfil. Tente novamente.';
        this.showToast(errorMessage, 'error');
      },
    });
  }

  /**
   * Fecha o modal sem salvar
   */
  closeModal(): void {
    this.closed.emit();
  }

  /**
   * Exibe notificação toast
   */
  private showToast(message: string, type: 'success' | 'error' = 'error'): void {
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
