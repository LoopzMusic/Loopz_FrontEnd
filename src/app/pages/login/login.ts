import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../shared/models/LoginRequest';
import { AuthService } from '../../services/auth-service';
import { CarrinhoService } from '../../services/carrinho/carrinho.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private carrinhoService = inject(CarrinhoService);
  private router = inject(Router);

  loginForm!: FormGroup;
  isAdmin = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

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

        // ✅ Sincroniza carrinho APÓS login bem-sucedido
        this.carrinhoService.carregarCarrinhoDoBackend().subscribe({
          next: () => {
            console.log('Carrinho carregado do backend');

            // Sincroniza itens locais (se houver)
            this.carrinhoService.sincronizarCarrinho().subscribe({
              next: () => console.log('Carrinho sincronizado'),
              error: (err) => console.error('Erro ao sincronizar:', err),
              complete: () => {
                // Navega após sincronização
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
            // Navega mesmo com erro
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
        alert('Usuário ou senha inválidos');
      },
    });
  }
}
