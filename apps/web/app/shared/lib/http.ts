const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return 'http://82.202.137.69:3000';
};

const API_BASE_URL = getApiBaseUrl();
// const API_BASE_URL = 'http://185.10.128.182:3000';

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
