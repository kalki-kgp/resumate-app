const DEFAULT_API_BASE_URL = 'https://resumate-api.kalkikgp.tech';
const ACCESS_TOKEN_STORAGE_KEY = 'resumate_access_token';

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

export const getApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
  return baseUrl.replace(/\/$/, '');
};

export const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const setStoredAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
};

export const clearStoredAccessToken = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
};

async function parseError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: string };
    if (typeof payload.detail === 'string' && payload.detail.trim().length > 0) {
      return payload.detail;
    }
  } catch {
    // Fallback to status text below.
  }

  return response.statusText || 'Request failed';
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  };

  if (options.body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const requestBody =
    options.body === undefined
      ? undefined
      : isFormData
        ? (options.body as FormData)
        : JSON.stringify(options.body);

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const detail = await parseError(response);
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
