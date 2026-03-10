import { HttpError } from './http-error.js';
export { HttpError } from './http-error.js';
export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};
export async function http(baseUrl, endpoint, options) {
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
    let parsedBody = null;
    try {
        parsedBody = await response.json();
    }
    catch {
        parsedBody = await response.text();
    }
    if (!response.ok) {
        let message = 'Неизвестная ошибка';
        if (isHttpErrorBody(parsedBody)) {
            if (Array.isArray(parsedBody.message)) {
                message = parsedBody.message.join(', ');
            }
            else if (typeof parsedBody.message === 'string') {
                message = parsedBody.message;
            }
        }
        throw new HttpError(response.status, message, parsedBody);
    }
    return parsedBody;
}
export const createHttp = (baseUrl) => (endpoint, options) => http(baseUrl, endpoint, options);
function isHttpErrorBody(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    return 'message' in value || 'statusCode' in value || 'error' in value;
}
//# sourceMappingURL=index.js.map