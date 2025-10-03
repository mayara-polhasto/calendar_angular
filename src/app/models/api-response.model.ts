
// para respostas único objeto
export interface ApiResponse<T> {
  data: T;
}

// lista de itens dentro de 'data'
export interface ApiListResponse<T> {
  data: {
    items: T[];
  };
}