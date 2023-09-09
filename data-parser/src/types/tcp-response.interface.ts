export interface ITcpResponse<T = string> {
  success: boolean;
  data: T;
}
