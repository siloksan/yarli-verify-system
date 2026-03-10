export { HttpError } from './http-error.js';
export declare const HTTP_METHODS: {
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
    readonly DELETE: "DELETE";
};
type RequestOptions<TBody> = {
    method?: keyof typeof HTTP_METHODS;
    body?: TBody;
    params?: Record<string, string | number | boolean | Array<string | number | boolean> | undefined>;
    headers?: HeadersInit;
};
export declare function http<TResponse, TBody = unknown>(baseUrl: string, endpoint?: `/${string}`, options?: RequestOptions<TBody>): Promise<TResponse>;
export declare const createHttp: (baseUrl: string) => <TResponse, TBody = unknown>(endpoint?: `/${string}`, options?: RequestOptions<TBody>) => Promise<TResponse>;
export interface DefaultHttpErrorBody {
    statusCode?: number;
    message?: string | string[];
    error?: string;
}
//# sourceMappingURL=index.d.ts.map