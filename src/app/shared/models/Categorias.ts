export const CATEGORIAS = [
  'CORDA',
  'TECLADO',
  'SOPRO',
  'PERCUSSAO'
] as const;

export type Categoria = typeof CATEGORIAS[number];