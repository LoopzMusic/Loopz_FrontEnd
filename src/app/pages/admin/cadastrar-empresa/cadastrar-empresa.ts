import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sidebar } from "../../../components/adm/sidebar/sidebar";
import { EmpresaService, Empresa } from '../../../services/empresa-service';
import { CnpjValidator } from '../../../validators/cpnjValidator';
import { CnpjApiService } from '../../../services/integracaoApis/cnpj-api-service';

@Component({
  selector: 'app-cadastrar-empresa',
  imports: [Sidebar, CommonModule, FormsModule],
  templateUrl: './cadastrar-empresa.html',
  styleUrl: './cadastrar-empresa.scss',
})
export class CadastrarEmpresa {
  private empresaService = inject(EmpresaService);
  private router = inject(Router);

  constructor(private cpnjService: CnpjApiService){}

  @ViewChild('toastEmpresa') toastEmpresa!: ElementRef;

  empresa: Empresa = {
    nmFantasia: '',
    nmRazao: '',
    nuCNPJ: '',
    nuTelefone: '',
    dsCidade: '',
    dsEstado: '',
    dsEndereco: '',
    nuEndereco: ''
  };

  cnpjInvalido = false;
  salvando = false;

  estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  consultarCnpj(): void {
  const cnpjLimpo = this.empresa.nuCNPJ.replace(/[^\d]/g, '');

  if (cnpjLimpo.length !== 14) {
    this.showToast('Digite um CNPJ válido para consultar!', 'error');
    return;
  }

  this.showToast('Consultando CNPJ...', 'success');

  this.cpnjService.consultarCnpj(cnpjLimpo).subscribe({
    next: (data) => {

      console.log('RETORNO DA API:', data);

      this.empresa.nmFantasia =
        data.nome_fantasia ||
        data.fantasia ||
        '';

      this.empresa.nmRazao =
        data.razao_social ||
        data.nome ||
        data.nome_empresarial ||
        '';

      this.empresa.dsCidade =
        data.municipio ||
        data.localidade ||
        '';

      this.empresa.dsEstado =
        data.uf ||
        data.estado ||
        '';

      this.empresa.dsEndereco =
        data.logradouro ||
        data.endereco ||
        '';

      this.empresa.nuEndereco =
        data.numero ||
        data.numero_endereco ||
        '';

      this.showToast('CNPJ encontrado e informações preenchidas!', 'success');
    },
    error: () => {
      this.showToast('Erro ao consultar CNPJ!', 'error');
    }
  });
}


  formatarCNPJ(): void {
    if (this.empresa.nuCNPJ) {
      let cnpjLimpo = this.empresa.nuCNPJ.replace(/[^\d]/g, '');
      
      if (cnpjLimpo.length > 14) {
        cnpjLimpo = cnpjLimpo.substring(0, 14);
      }
      
      if (cnpjLimpo.length <= 14) {
        this.empresa.nuCNPJ = cnpjLimpo
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
      }
      
      this.validarCNPJ();
    }
  }

  validarCNPJ(): void {
    if (!this.empresa.nuCNPJ) {
      this.cnpjInvalido = false;
      return;
    }
    
    this.cnpjInvalido = !CnpjValidator.validarCNPJ(this.empresa.nuCNPJ);
  }

  formatarTelefone(): void {
    if (this.empresa.nuTelefone) {
      let telefoneLimpo = this.empresa.nuTelefone.replace(/[^\d]/g, '');
      
      if (telefoneLimpo.length > 11) {
        telefoneLimpo = telefoneLimpo.substring(0, 11);
      }
      
      if (telefoneLimpo.length === 11) {
        this.empresa.nuTelefone = telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (telefoneLimpo.length === 10) {
        this.empresa.nuTelefone = telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        this.empresa.nuTelefone = telefoneLimpo;
      }
    }
  }

  cadastrarEmpresa(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.salvando = true;

    
    const empresaParaEnviar = {
      ...this.empresa,
      nuCNPJ: this.empresa.nuCNPJ.replace(/[^\d]/g, ''),
      nuTelefone: this.empresa.nuTelefone.replace(/[^\d]/g, '')
    };

    this.empresaService.criarEmpresa(empresaParaEnviar).subscribe({
      next: (response) => {
        console.log('Empresa cadastrada:', response);
        this.showToast('Empresa cadastrada com sucesso!', 'success');
        this.salvando = false;
        
        
        this.limparFormulario();
        
        setTimeout(() => {
          this.router.navigate(['/admin/empresas']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erro ao cadastrar empresa:', error);
        this.salvando = false;
        
        if (error.status === 409) {
          this.showToast('CNPJ, Razão Social ou Telefone já cadastrados!', 'error');
        } else {
          this.showToast('Erro ao cadastrar empresa!', 'error');
        }
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.empresa.nmFantasia || !this.empresa.nmRazao || 
        !this.empresa.nuCNPJ || !this.empresa.nuTelefone ||
        !this.empresa.dsCidade || !this.empresa.dsEstado ||
        !this.empresa.dsEndereco || !this.empresa.nuEndereco) {
      this.showToast('Preencha todos os campos obrigatórios!', 'error');
      return false;
    }

    if (this.cnpjInvalido) {
      this.showToast('CNPJ inválido!', 'error');
      return false;
    }

    return true;
  }

  limparFormulario(): void {
    this.empresa = {
      nmFantasia: '',
      nmRazao: '',
      nuCNPJ: '',
      nuTelefone: '',
      dsCidade: '',
      dsEstado: '',
      dsEndereco: '',
      nuEndereco: ''
    };
    this.cnpjInvalido = false;
  }

  showToast(msg: string, type: 'success' | 'error'): void {
    if (this.toastEmpresa) {
      const toastElement = this.toastEmpresa.nativeElement;
      const toastBody = toastElement.querySelector('.toast-body');
      
      if (toastBody) {
        toastBody.textContent = msg;
      }
      
      toastElement.classList.remove('text-bg-success', 'text-bg-danger');
      toastElement.classList.add(type === 'success' ? 'text-bg-success' : 'text-bg-danger');
      
      // @ts-ignore
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
}