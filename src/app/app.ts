import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { RouterModule } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Login } from "./pages/login/login";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  
  imports: [RouterOutlet, Navbar, RouterModule, Footer, Login],

  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Loopz_FrontEnd');
  router: any;

  isLoginRoute(): boolean{
    return this.router.url === '/login';
  }
}
