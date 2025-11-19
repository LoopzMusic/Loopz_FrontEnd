export class Empresa {
  constructor(
    public cdEmpresa = 0,
    public nmFantasia = '',
    public nmRazao = '',
    public nuCNPJ = '',
    public nuTelefone = '',
    public dsCidade = '',
    public dsEstado = '',
    public dsEndereco = '',
    public nuEndereco = '',
    public flAtivo = '',
    public produtos = [0]
  ) {}
}