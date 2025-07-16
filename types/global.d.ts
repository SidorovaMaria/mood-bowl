export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  status?: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  status?: number;
}
