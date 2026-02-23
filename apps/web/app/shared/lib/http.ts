// const BASE_API_URL = 'http://192.168.0.52:3000';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = 'https://scaling-cod-rq4jw5wvrggcpwqj-3000.app.github.dev';
console.log(API_BASE_URL)

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
  console.log('options: ', options);

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
