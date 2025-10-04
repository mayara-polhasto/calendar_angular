
//definindo interfaces
export interface ImageUrls {
  medium: string;
  full?: string;
  small?: string;
}

export interface EventImage {
  urls: ImageUrls;
}

export interface TimelyEvent {
  // Propriedades
  ticket_type: string;
  cost_display: string;
  featured: boolean;
  instance: string;
  start_datetime: string;

  title?: string;
  description_short?: string;
  image?: EventImage;
}