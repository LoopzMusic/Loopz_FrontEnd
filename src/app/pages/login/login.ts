import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../shared/models/LoginRequest';
import { AuthService } from '../../services/auth-service';
import { OAuth2Service } from '../../services/oauth2.service';
import { CarrinhoService } from '../../services/carrinho/carrinho.service';
import { ShowToast } from '../../components/show-toast/show-toast';
import { ProfileCompletionModal } from '../../components/profile-completion-modal/profile-completion-modal';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [ReactiveFormsModule, RouterModule, CommonModule, ShowToast, ProfileCompletionModal],
})
export class Login implements OnInit, AfterViewInit {
  @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private oauth2Service = inject(OAuth2Service);
  private carrinhoService = inject(CarrinhoService);
  private router = inject(Router);

  loginForm!: FormGroup;
  isAdmin = false;
  showProfileModal = false;
  isLoggingIn = false;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  };

  // Seu Google Client ID - substitua pelo seu ID real
  private googleClientId =
    '149009561372-f3s2akfb66v9iemdl50ldi4qulbn4f3h.apps.googleusercontent.com';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Inicializa o Google Sign-In
    this.initializeGoogleSignIn();
  }

  ngAfterViewInit(): void {
    // Renderiza o botão do Google após a view ser inicializada
    if (this.googleButtonContainer) {
      this.oauth2Service.renderGoogleButton('google-button-container');
    }
  }

  /**
   * Inicializa o Google Sign-In
   */
  private initializeGoogleSignIn(): void {
    // IMPORTANTE: Substitua 'SEU_GOOGLE_CLIENT_ID_AQUI' pelo seu Client ID real do Google
    this.oauth2Service.initializeGoogleSignIn(
      this.googleClientId,
      (response) => this.handleGoogleSignInSuccess(response),
      () => this.handleGoogleSignInError()
    );
  }

  /**
   * Manipula o sucesso do login do Google
   * Agora com melhor tratamento de erros e timeout
   */
  private handleGoogleSignInSuccess(response: any): void {
    this.isLoggingIn = true;

    // Define um timeout de 10 segundos para evitar carregamento infinito
    const timeoutId = setTimeout(() => {
      console.warn('Timeout ao processar login do Google');
      this.isLoggingIn = false;
      this.verificarPerfilCompleto();
    }, 10000);

    // Primeiro, verifica se o perfil está completo
    this.verificarPerfilCompleto().then(() => {
      clearTimeout(timeoutId);

      // Se o perfil não está completo, não carrega o carrinho
      if (this.showProfileModal) {
        this.isLoggingIn = false;
        return;
      }

      // Se o perfil está completo, carrega o carrinho
      this.carrinhoService.carregarCarrinhoDoBackend().subscribe({
        next: () => {
          console.log('Carrinho carregado do backend');

          this.carrinhoService.sincronizarCarrinho().subscribe({
            next: () => {
              console.log('Carrinho sincronizado');
              this.isLoggingIn = false;
              this.router.navigate(['']);
            },
            error: (err) => {
              console.error('Erro ao sincronizar carrinho:', err);
              this.isLoggingIn = false;
              this.router.navigate(['']);
            },
          });
        },
        error: (err) => {
          console.error('Erro ao carregar carrinho:', err);
          this.isLoggingIn = false;
          this.router.navigate(['']);
        },
      });
    });
  }

  /**
   * Verifica se o perfil do usuário está completo
   * Retorna uma Promise para melhor controle de fluxo
   */
  private verificarPerfilCompleto(): Promise<void> {
    return new Promise((resolve) => {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        const usuarioData = JSON.parse(usuario);

        // Se o perfil não está completo, mostra o modal
        if (!usuarioData.profileComplete) {
          console.log('Perfil incompleto, exibindo modal');
          this.showProfileModal = true;
          resolve();
        } else {
          // Perfil já está completo
          console.log('Perfil completo, redirecionando');
          this.showProfileModal = false;
          resolve();
        }
      } else {
        console.warn('Usuário não encontrado no localStorage');
        this.isLoggingIn = false;
        resolve();
      }
    });
  }

  /**
   * Manipula o erro do login do Google
   */
  private handleGoogleSignInError(): void {
    this.isLoggingIn = false;
    this.showToast('Erro ao fazer login com Google. Tente novamente.', 'error');
  }

  /**
   * Submete o formulário de login tradicional
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = new LoginRequest(this.loginForm.value.email, this.loginForm.value.senha);

    this.authService.login(loginData, this.isAdmin).subscribe({
      next: (res) => {
        this.authService.setUsuario(res);
        console.log('Login sucesso:', res);

        this.carrinhoService.carregarCarrinhoDoBackend().subscribe({
          next: () => {
            console.log('Carrinho carregado do backend');

            this.carrinhoService.sincronizarCarrinho().subscribe({
              next: () => console.log('Carrinho sincronizado'),
              error: (err) => console.error('Erro ao sincronizar:', err),
              complete: () => {
                if (this.isAdmin) {
                  this.router.navigate(['/admin/dashboard']);
                } else {
                  this.router.navigate(['']);
                }
              },
            });
          },
          error: (err) => {
            console.error('Erro ao carregar carrinho:', err);

            if (this.isAdmin) {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['']);
            }
          },
        });
      },
      error: (err) => {
        console.error('Erro ao logar:', err);
        this.showToast('Usuário ou senha inválidos', 'error');
      },
    });
  }

  /**
   * Manipula a conclusão do preenchimento do perfil
   */
  onProfileCompleted(): void {
    this.showProfileModal = false;
    this.showToast('Perfil completado com sucesso!', 'success');

    // Aguarda um pouco antes de redirecionar
    setTimeout(() => {
      this.isLoggingIn = false;
      this.router.navigate(['']);
    }, 1500);
  }

  /**
   * Manipula o fechamento do modal de perfil
   */
  onProfileModalClosed(): void {
    this.showProfileModal = false;
    this.isLoggingIn = false;
    // ✅ IMPORTANTE: Não redireciona para home, mantém na tela de login
    this.showToast('Complete seu perfil para usar o e-commerce', 'error');
  }

  /**
   * Exibe notificação toast
   */
  showToast(message: string, type: 'success' | 'error' = 'error'): void {
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
