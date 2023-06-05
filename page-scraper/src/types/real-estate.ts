export interface IRealEstate {
  url: string;
  title: string;
  description: string;
  publish_date: Date;
  city: string;
  district?: string;
  price: number;
  currency: string;
  ad_id: string;
  'online-viewing'?: boolean;
  'postal-code': string;
  'reference-number'?: string;
  'registration-number'?: number;
  'registration-block'?: number;
  'square-meter-price': number;
}
