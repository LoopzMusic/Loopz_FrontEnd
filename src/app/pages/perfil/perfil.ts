import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Usuario } from '../../shared/models/Usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  usuario: Usuario | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getUsuarioLogado();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = user;
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }
}
