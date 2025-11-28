import { ItemPedidoResponseDto } from "./ItemPedido";

export interface ItemPedido {
  cdProduto: number | null;
  nmProduto: string | null;
  quantidade: number | null;
  precoPorProdutoUnidade: number | null;
  total: number;
}

export interface PedidoResumo {
  cdPedido: number;
  valorTotal: number;
  itens: ItemPedidoResponseDto[];
}