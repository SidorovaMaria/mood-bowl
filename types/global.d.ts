interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  status?: number;
}

interface ErrorResponse {
  success: false;
  message: string;
  status?: number;
}

export type ActionResponse<T> = SuccessResponse<T> | ErrorResponse;
