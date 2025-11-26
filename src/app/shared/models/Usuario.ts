export class Usuario {
  constructor(
    public cdUsuario?: number,
    public nmCliente = '',
    public nuCPF = '',
    public nuTelefone = '',
    public dsCidade = '',
    public dsEstado = '',
    public dsEndereco = '',
    public nuEndereco = '',
    public dsEmail = '',
    public flAtivo = ''
  ) {}
}
