import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Usuario } from '../../shared/models/Usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  usuario!: Usuario | null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuarioLogado();

    if (!this.usuario) {
      this.router.navigate(['/login']);
    }
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }
}
