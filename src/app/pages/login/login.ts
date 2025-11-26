import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../shared/models/LoginRequest';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isAdmin = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && this.isAdmin == true) {
      console.log('Dados do Login:', this.loginForm.value);
    } else if (this.loginForm.valid) {
      console.log('Dados do Login:', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = new LoginRequest(this.loginForm.value.email, this.loginForm.value.senha);

    this.authService.login(loginData, this.isAdmin).subscribe({
      next: (res) => {
        this.authService.setUsuario(res);
        console.log('Login sucesso:', res);
        if (this.isAdmin) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['']);
        }
      },
      error: (err) => {
        console.error('Erro ao logar:', err);
        alert('Usuário ou senha inválidos');
      },
    });
  }
}
