# 🛒 E-commerce Hardware - Frontend

> Interface moderna e responsiva para e-commerce de hardware desenvolvida com Angular 20

[![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)](https://angular.io/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap)](https://getbootstrap.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Sobre o Projeto

Este é o frontend de um e-commerce especializado em hardware, desenvolvido com Angular. A aplicação oferece uma experiência de compra completa com integração a APIs de geolocalização, sistema de pagamentos e autenticação segura via OAuth2.

> 🔗 **Importante**: Este frontend requer o [Backend Spring Boot](./backend/README.md) em execução. Veja as instruções de instalação do backend antes de prosseguir.

## ✨ Principais Funcionalidades

- 🛍️ **Catálogo de Produtos** - Navegação e busca de produtos de hardware
- 🛒 **Carrinho de Compras** - Gerenciamento completo do carrinho
- 🗺️ **Cálculo de Frete** - Integração com Google Matrix Distance API
- 📍 **Busca de CEP** - Preenchimento automático de endereço via ViaCEP
- 💳 **Pagamentos** - Checkout integrado com AbacatePay
- 🔐 **Autenticação** - Login seguro com OAuth2 (Google)
- 👤 **Perfil de Usuário** - Gestão de dados pessoais e pedidos
- 📦 **Histórico de Pedidos** - Acompanhamento de compras

## 🛠️ Tecnologias Utilizadas

### Core
- **Angular 20** - Framework principal
- **TypeScript 5** - Linguagem de programação
- **RxJS** - Programação reativa
- **Angular Router** - Navegação SPA
- **Angular Forms** - Formulários reativos e validações

### UI/UX
- **Bootstrap 5** - Framework CSS responsivo
- **Angular Material** (opcional) - Componentes UI
- **Font Awesome** - Ícones

### Integrações de APIs
- **Google Matrix Distance API** - Cálculo de distâncias para frete
- **ViaCEP API** - Consulta de CEPs brasileiros
- **AbacatePay** - Gateway de pagamento simplificado
- **OAuth2 (Google)** - Autenticação de usuários

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior
- [Angular CLI](https://angular.io/cli) v20
- [Git](https://git-scm.com/)

```bash
# Verificar versões instaladas
node --version
npm --version
ng version
```

> ⚠️ **Backend Necessário**: Certifique-se de que o [backend Spring Boot](./backend/README.md) está instalado e rodando em `http://localhost:8085`

## 🚀 Instalação e Configuração

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/ecommerce-hardware.git
cd ecommerce-hardware/frontend
```

### 2️⃣ Instale as Dependências

```bash
npm install
```

### 3️⃣ Configure as Variáveis de Ambiente

#### Ambiente de Desenvolvimento

Edite o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  
  // URL do backend Spring Boot
  apiUrl: 'http://localhost:8085/api',
  
  // Google Maps API
  googleMapsApiKey: 'SUA_GOOGLE_MAPS_API_KEY',
  
  // AbacatePay
  abacatePayPublicKey: 'SUA_ABACATE_PAY_PUBLIC_KEY',
  
  // OAuth2 Google
  oauth: {
    clientId: 'SEU_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4200/auth/callback',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'http://localhost:8085/api/auth/google',
    scope: 'openid profile email'
  },
  
  // ViaCEP (não requer chave)
  viaCepUrl: 'https://viacep.com.br/ws'
};
```

#### Ambiente de Produção

Edite o arquivo `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://sua-api.com/api',
  googleMapsApiKey: 'SUA_GOOGLE_MAPS_API_KEY_PRODUCAO',
  abacatePayPublicKey: 'SUA_ABACATE_PAY_PUBLIC_KEY_PRODUCAO',
  oauth: {
    clientId: 'SEU_GOOGLE_CLIENT_ID_PRODUCAO.apps.googleusercontent.com',
    redirectUri: 'https://seu-dominio.com/auth/callback',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://sua-api.com/api/auth/google',
    scope: 'openid profile email'
  },
  viaCepUrl: 'https://viacep.com.br/ws'
};
```

### 4️⃣ Execute a Aplicação

#### Modo Desenvolvimento

```bash
ng serve
```

A aplicação estará disponível em **http://localhost:4200**

#### Com Abertura Automática do Navegador

```bash
ng serve --open
```

#### Porta Customizada

```bash
ng serve --port 4300
```

#### Build de Produção

```bash
ng build --configuration production
```

Os arquivos otimizados estarão em `dist/`

## 🔑 Obtendo as Chaves de API

### 1. Google Matrix Distance API

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Distance Matrix API** no menu de APIs
4. Vá em **Credenciais** → **Criar credenciais** → **Chave de API**
5. Configure restrições de API (recomendado)
6. Copie a chave gerada

**Documentação**: [Google Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)

### 2. ViaCEP

✅ **Não requer cadastro ou chave de API!**

A API ViaCEP é gratuita e de uso livre para consulta de CEPs brasileiros.

**Documentação**: [ViaCEP](https://viacep.com.br/)

### 3. AbacatePay

AbacatePay é um gateway de pagamento simplificado com API descomplicada, baseada em intenção, idempotente e consistente.

1. Cadastre-se em [AbacatePay](https://abacatepay.com/)
2. Acesse o painel de desenvolvedor
3. Copie sua **Public Key** (chave pública)
4. Configure os webhooks para receber notificações de pagamento

**Documentação**: [AbacatePay Docs](https://docs.abacatepay.com/pages/introduction)

**Suporte**: ajuda@abacatepay.com

### 4. OAuth2 Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Vá em **APIs e Serviços** → **Credenciais**
3. Clique em **Criar Credenciais** → **ID do cliente OAuth 2.0**
4. Tipo de aplicativo: **Aplicativo da Web**
5. Adicione as URIs de redirecionamento:
   - Desenvolvimento: `http://localhost:4200/auth/callback`
   - Produção: `https://seu-dominio.com/auth/callback`
6. Copie o **Client ID**

> ⚠️ **Importante**: O Client Secret deve ser configurado apenas no backend por segurança.


## 🔌 Integração com o Backend

Este frontend consome a API REST do backend Spring Boot. Certifique-se de que o backend está rodando antes de iniciar o frontend.

### Principais Endpoints Consumidos

> 📖 Para detalhes completos da API, consulte o [README do Backend](./backend/README.md) ou acesse a documentação Swagger em `http://localhost:8085/swagger-ui.html`


## 📱 Funcionalidades Detalhadas

### 🗺️ Cálculo de Frete com Google Maps

```typescript
// distance.service.ts
calculateShipping(origin: string, destination: string): Observable<ShippingInfo> {
  return this.http.post<ShippingInfo>(`${environment.apiUrl}/shipping/calculate`, {
    origin,
    destination,
    apiKey: environment.googleMapsApiKey
  });
}
```

### 📍 Busca de CEP com ViaCEP

```typescript
// cep.service.ts
searchCep(cep: string): Observable<Address> {
  const cleanCep = cep.replace(/\D/g, '');
  return this.http.get<Address>(`${environment.viaCepUrl}/${cleanCep}/json/`);
}
```

### 💳 Pagamentos com AbacatePay

```typescript
// payment.service.ts
createPayment(order: Order): Observable<PaymentResponse> {
  return this.http.post<PaymentResponse>(`${environment.apiUrl}/payments/create`, {
    amount: order.total,
    description: `Pedido #${order.id}`,
    publicKey: environment.abacatePayPublicKey,
    metadata: {
      orderId: order.id,
      userId: order.userId
    }
  });
}
```

### 🔐 Autenticação OAuth2 Google

```typescript
// auth.service.ts
loginWithGoogle(): void {
  const params = new URLSearchParams({
    client_id: environment.oauth.clientId,
    redirect_uri: environment.oauth.redirectUri,
    response_type: 'code',
    scope: environment.oauth.scope,
    access_type: 'offline',
    prompt: 'consent'
  });
  
  window.location.href = `${environment.oauth.authorizationEndpoint}?${params}`;
}

handleCallback(code: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${environment.oauth.tokenEndpoint}`, { code });
}
```

## 🐛 Problemas Comuns

### ❌ Erro de CORS

Se encontrar erros de CORS, verifique se o backend está configurado corretamente para aceitar requisições do frontend:

```java
// No backend Spring Boot - SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:4200");
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);
    // ...
}
```

### ❌ API Keys Inválidas

### ❌ Backend Não Está Respondendo

Certifique-se de que o backend está rodando:

```bash
# No diretório do backend
mvn spring-boot:run
```
### ❌ Porta em Uso

Se a porta 4200 estiver em uso:

```bash
ng serve --port 4300
```

### ❌ Erro ao Instalar Dependências

Limpe o cache do npm e reinstale:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🚢 Deploy

### Build de Produção

```bash
npm run build:prod
```

### Servir Build Localmente

```bash
npm install -g http-server
http-server dist/ecommerce-frontend -p 8085
```
## 🤝 Contribuindo

### Padrões de Código

- Use **Prettier** para formatação
- Siga o **Angular Style Guide**
- Escreva testes para novas funcionalidades
- Mantenha commits semânticos

## 📖 Documentação Adicional

- [Angular Documentation](https://angular.io/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Backend API Documentation](./backend/README.md)
- [AbacatePay API](https://docs.abacatepay.com/)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- Comunidade Angular
- Google Maps Platform
- ViaCEP
- AbacatePay Team
- Spring Boot Community

---

🔗 **Links Relacionados**:
- [📦 Backend Spring Boot](./backend/README.md)
- [📖 Documentação da API](http://localhost:8085/swagger-ui.html)

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
