const getApiBaseUrl = (): string => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (envBaseUrl && typeof window !== 'undefined') {
    try {
      const parsedEnvUrl = new URL(envBaseUrl);
      const isEnvLocalhost =
        parsedEnvUrl.hostname === 'localhost' ||
        parsedEnvUrl.hostname === '127.0.0.1';
      const isBrowserLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isEnvLocalhost && !isBrowserLocalhost) {
        return `${window.location.protocol}//${window.location.hostname}:3000`;
      }
    } catch {
      // Keep invalid env value behavior unchanged; return it below.
    }
  }

  if (envBaseUrl) {
    return envBaseUrl;
  }

  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }

  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type RequestOptions<TBody> = {
  method?: keyof typeof HTTP_METHODS;
  body?: TBody;
  params?: Record<
    string,
    string | number | boolean | Array<string | number | boolean> | undefined
  >;
  headers?: HeadersInit;
};

export async function http<TResponse, TBody = unknown>(
  endpoint?: `/${string}`,
  options?: RequestOptions<TBody>,
): Promise<TResponse> {
  const { method = HTTP_METHODS.GET, body, params, headers } = options ?? {};

  let finalUrl = `${API_BASE_URL}${endpoint || ''}`;

  if (params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const normalizedValue = Array.isArray(value)
          ? value.join(',')
          : String(value);
        return `${encodeURIComponent(key)}=${encodeURIComponent(normalizedValue)}`;
      })
      .join('&');

    if (queryString) {
      finalUrl += `?${queryString}`;
    }
  }

  const response = await fetch(finalUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP error ${response.status}`);
  }

  return response.json();
}
