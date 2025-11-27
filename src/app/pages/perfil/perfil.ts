import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UsuarioService } from '../../services/usuario/usuario-service';
import { Usuario } from '../../shared/models/Usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CpfValidator } from '../../services/validacoes/cpfValidator'; 

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  @ViewChild('toastPerfil') toastPerfil!: ElementRef;

  usuario: Usuario | null = null;
  usuarioOriginal: Usuario | null = null;
  carregando = true;
  modoEdicao = false;
  salvando = false;
  cpfInvalido = false;

  ngOnInit(): void {
    const user = this.authService.getUsuarioLogado();

    if (!user || !user.cdUsuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioService.buscarUsuarioPorId(user.cdUsuario).subscribe({
      next: (usuarioCompleto) => {
        this.usuario = { ...usuarioCompleto, cdUsuario: user.cdUsuario };
        this.usuarioOriginal = { ...this.usuario };
        this.carregando = false;
        
        const usuarioAtualizado = {
          ...user,
          ...usuarioCompleto
        };
        this.authService.setUsuario(usuarioAtualizado);
      },
      error: (error) => {
        console.error('Erro ao buscar usuário:', error);
        this.carregando = false;
        this.usuario = user;
        this.usuarioOriginal = { ...user };
      }
    });
  }

  ativarEdicao() {
    this.modoEdicao = true;
    this.usuarioOriginal = { ...this.usuario! };
  }

  cancelarEdicao() {
    this.usuario = { ...this.usuarioOriginal! };
    this.modoEdicao = false;
    this.cpfInvalido = false;
  }

  validarCPF() {
    if (!this.usuario?.nuCPF) {
      this.cpfInvalido = false;
      return;
    }
    
    this.cpfInvalido = !CpfValidator.validarCPF(this.usuario.nuCPF);
  }

  formatarCPF() {
    if (this.usuario?.nuCPF) {
      
      let cpfLimpo = this.usuario.nuCPF.replace(/[^\d]/g, '');
      
      
      if (cpfLimpo.length > 11) {
        cpfLimpo = cpfLimpo.substring(0, 11);
      }
      
      
      if (cpfLimpo.length <= 11) {
        this.usuario.nuCPF = cpfLimpo
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      
      
      this.validarCPF();
    }
  }

  salvarAlteracoes() {
    if (!this.usuario || !this.usuario.cdUsuario) {
      this.showToast('Erro ao salvar alterações!');
      return;
    }

    
    if (!CpfValidator.validarCPF(this.usuario.nuCPF)) {
      this.cpfInvalido = true;
      this.showToast('CPF inválido!');
      return;
    }

    this.salvando = true;

    const dadosAtualizar = {
      nmCliente: this.usuario.nmCliente,
      nuCPF: this.usuario.nuCPF,
      nuTelefone: this.usuario.nuTelefone,
      dsCidade: this.usuario.dsCidade,
      dsEstado: this.usuario.dsEstado,
      dsEndereco: this.usuario.dsEndereco,
      nuEndereco: this.usuario.nuEndereco,
      dsEmail: this.usuario.dsEmail,
      flAtivo: this.usuario.flAtivo
    };

    this.usuarioService.atualizarUsuario(this.usuario.cdUsuario, dadosAtualizar).subscribe({
      next: (response) => {
        console.log('Usuário atualizado:', response);
        
        const usuarioAtualizado = {
          cdUsuario: this.usuario!.cdUsuario,
          ...dadosAtualizar
        };
        this.authService.setUsuario(usuarioAtualizado);
        
        this.usuarioOriginal = { ...this.usuario! };
        this.modoEdicao = false;
        this.salvando = false;
        this.cpfInvalido = false;
        this.showToast('Perfil atualizado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
        this.salvando = false;
        this.showToast('Erro ao atualizar perfil!');
      }
    });
  }

  showToast(msg: string) {
    if (this.toastPerfil) {
      this.toastPerfil.nativeElement.querySelector('.toast-body').textContent = msg;
      // @ts-ignore
      const toast = new bootstrap.Toast(this.toastPerfil.nativeElement);
      toast.show();
    } else {
      alert(msg);
    }
  }
}