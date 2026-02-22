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
  baseUrl: string,
  endpoint?: `/${string}`,
  options?: RequestOptions<TBody>,
): Promise<TResponse> {
  const { method = HTTP_METHODS.GET, body, params, headers } = options ?? {};
  console.log('options: ', options);

  let finalUrl = `${baseUrl}${endpoint || ''}`;

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

export const createHttp =
  (baseUrl: string) =>
  <TResponse, TBody = unknown>(
    endpoint?: `/${string}`,
    options?: RequestOptions<TBody>,
  ) =>
    http<TResponse, TBody>(baseUrl, endpoint, options);
