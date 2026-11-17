const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://wherecipe-backend.onrender.com/api/v1";

const TOKEN_KEY = "wherecipe.token";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

type ApiErrorBody = {
  message?: string;
  errors?: Array<{ message?: string; field?: string }>;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractMessage(body: ApiErrorBody | null, fallback: string) {
  if (!body) return fallback;
  if (body.errors?.[0]?.message) return body.errors[0].message;
  if (body.message) return body.message;
  return fallback;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const body = text ? (JSON.parse(text) as ApiErrorBody & T) : null;

  if (!response.ok) {
    throw new ApiError(
      extractMessage(body, "Não foi possível concluir a requisição."),
      response.status,
    );
  }

  return body as T;
}
