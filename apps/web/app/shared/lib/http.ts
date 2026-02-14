const BASE_API_URL = 'http://192.168.0.52:3000';
// const BASE_API_URL = 'http://185.10.128.182:3000'; //netlify deploy access

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type RequestOptions<TBody> = {
  method?: keyof typeof HTTP_METHODS;
  body?: TBody;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
};

export async function http<TResponse, TBody = unknown>(
  endpoint?: `/${string}`,
  options?: RequestOptions<TBody>,
): Promise<TResponse> {
  const { method = HTTP_METHODS.GET, body, params, headers } = options ?? {};
  console.log('options: ', options);

  let finalUrl = `${BASE_API_URL}${endpoint || ''}`;

  if (params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
      })
      .join('&');

    if (queryString) {
      finalUrl += `?${queryString}`;
    }
  }

  console.log('finalUrl: ', finalUrl);
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
