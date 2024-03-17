export interface IResponse<TData = { [key: string]: unknown }> {
  status: number;
  data: TData | null;
  errors?: string[] | null;
}
