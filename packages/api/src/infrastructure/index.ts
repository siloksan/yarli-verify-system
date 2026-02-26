import { HttpError } from './http-error.js';

export { HttpError } from './http-error.js';

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

  let parsedBody: unknown = null;

  try {
    parsedBody = await response.json();
  } catch {
    parsedBody = await response.text();
  }

  if (!response.ok) {
    let message = 'Неизвестная ошибка';

    if (isHttpErrorBody(parsedBody)) {
      if (Array.isArray(parsedBody.message)) {
        message = parsedBody.message.join(', ');
      } else if (typeof parsedBody.message === 'string') {
        message = parsedBody.message;
      }
    }

    throw new HttpError(response.status, message, parsedBody);
  }

  return parsedBody as TResponse;
}

/**
 * Creates a function that makes HTTP requests to the given base URL.
 *
 * @param {string} baseUrl - The base URL for the HTTP requests.
 *
 * @returns {(endpoint?: string, options?: RequestOptions<TBody>) => Promise<TResponse>} -
 *   A function that makes an HTTP request to the given endpoint with the given options.
 *   The function returns a promise that resolves to the response data.
 *   If the response status is not OK, the promise is rejected with an error that includes the response status and text.
 */
export const createHttp =
  (baseUrl: string) =>
  <TResponse, TBody = unknown>(
    endpoint?: `/${string}`,
    options?: RequestOptions<TBody>,
  ) =>
    http<TResponse, TBody>(baseUrl, endpoint, options);

export interface DefaultHttpErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}
function isHttpErrorBody(value: unknown): value is DefaultHttpErrorBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'message' in value || 'statusCode' in value || 'error' in value;
}
