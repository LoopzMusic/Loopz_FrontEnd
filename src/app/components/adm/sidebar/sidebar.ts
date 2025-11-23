import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);

  activeItem: string = '';

  ngOnInit(): void {
    this.setActiveItemFromRoute(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setActiveItemFromRoute(event.urlAfterRedirects || event.url);
      });
  }

  navigateTo(route: string, item: string): void {
    this.activeItem = item;
    this.router.navigate([route]);
  }

  private setActiveItemFromRoute(url: string): void {
    if (url.includes('/admin/dashboard')) {
      this.activeItem = 'dashboard';
    } else if (url.includes('/admin/cadastrar-produto')) {
      this.activeItem = 'cadastrar';
    } else if (url.includes('/admin/gerenciar-produtos')) {
      this.activeItem = 'produtos';
    } else if (url.includes('/admin/produto-vendido')) {
      this.activeItem = 'vendidos';
    } else if (url.includes('/admin/avaliacoes')) {
      this.activeItem = 'avaliacoes';
    } else if (url.includes('/admin/estoque-baixo')) {
      this.activeItem = 'estoque-baixo';
    }
  }
}
