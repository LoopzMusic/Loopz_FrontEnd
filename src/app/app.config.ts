import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { routes } from './app.routes';
import { CarrinhoService } from './services/carrinho/carrinho.service';

/**
 * Função para inicializar o carrinho quando o app carrega
 */
export function initializeApp(carrinhoService: CarrinhoService) {
  return () => {
    // Verifica se há usuário logado diretamente do localStorage
    const usuarioStr = localStorage.getItem('usuario');

    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);

      // Se houver usuário logado, carrega o carrinho do backend
      if (usuario && usuario.cdUsuario) {
        return carrinhoService
          .carregarCarrinhoDoBackend()
          .toPromise()
          .catch((err) => {
            console.error('Erro ao inicializar carrinho:', err);
            return Promise.resolve();
          });
      }
    }

    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [CarrinhoService], // ✅ Só depende de CarrinhoService
      multi: true,
    },
  ],
};
