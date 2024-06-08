export interface UpdateResponse {
  id: string;
  status: boolean;
}

export interface CreateResponse {
  id: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    pageSize: number;
    currentPage: number;
  };
}

export const success = (
  data: Record<string, any> | string,
  message?: string,
  meta?: any,
) => {
  return {
    status: 'success',
    message: message || 'success',
    data,
    meta,
  };
};

export const failed = (message?: string, meta?: any) => {
  return {
    status: 'failed',
    data: null,
    message: message || 'failed',
    meta,
  };
};
