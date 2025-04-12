export interface Order {
  id: number;
  info: string;
  weight: number;
  from: string;
  to: string;
  date_start: Date;
  date_end: Date;
  user_id: number;
  status_id: number;
  files?: [];
  deliveryDates?: Date[];
}

export enum Type {
  update = "UPDATE",
  create = "CREATE",
}

export interface OrderDto {
  info: string;
  weight: number;
  from: string;
  to: string;
  date_start: string;
  date_end: string;
  user_id: number;
  status_id: number;
}
