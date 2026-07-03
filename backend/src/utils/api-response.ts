export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ErrorDetail[];
}

export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string, errors?: ErrorDetail[]): ApiResponse {
  return {
    success: false,
    message,
    errors,
  };
}

