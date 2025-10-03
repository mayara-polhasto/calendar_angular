
// Interface para o objeto aninhado de URLs da imagem
export interface ImageUrls {
  medium: string;
}

// Interface para o objeto de imagem
export interface EventImage {
  urls: ImageUrls;
}

// A interface principal para cada evento
export interface TimelyEvent {
  // Propriedades que vimos na imagem
  ticket_type: string;
  cost_display: string;
  featured: boolean;
  instance: string;
  start_datetime: Date;

  title?: string;
  description_short?: string;
  image?: any; //tp não identificado
}