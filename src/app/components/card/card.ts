import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Produto } from '../../shared/models/Produto';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {

  @Input({ required: true }) produto: Produto = new Produto();
  @ViewChild('toastFavorito') toastFavorito!: ElementRef;

  favorito = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    this.favorito = favoritos.some((p: any) => p.cdProduto === this.produto.cdProduto);
  }

  adicionarFavorito() {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

    if (this.favorito) {
      favoritos = favoritos.filter((p: any) => p.cdProduto !== this.produto.cdProduto);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));

      this.favorito = false;

      if (this.router.url.includes('favoritos')) {
        this.router.navigate(['/produtos']);
      }

      this.showToast("Removido dos favoritos!");
    } else {
      favoritos.push(this.produto);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));

      this.favorito = true;
      this.showToast("Adicionado aos favoritos!");
    }
  }

  showToast(msg: string) {
    this.toastFavorito.nativeElement.querySelector('.toast-body').textContent = msg;

    // @ts-ignore
    const toast = new bootstrap.Toast(this.toastFavorito.nativeElement);
    toast.show();
  }

}
