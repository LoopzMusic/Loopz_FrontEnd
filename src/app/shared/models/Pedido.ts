export class Pedido {
  constructor(
    public cdUsuario = 0,
    public formaPagamento = '',
    public vlFrete = 0,
    public statusPedido = '',
    public vlTotalPedido = 0
  ) {}
}