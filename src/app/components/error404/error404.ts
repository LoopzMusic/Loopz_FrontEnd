import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagina-404',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './error404.html',
  styleUrl: './error404.scss'
})
export class Error404 {}