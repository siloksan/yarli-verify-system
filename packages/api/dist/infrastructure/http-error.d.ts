export declare class HttpError extends Error {
    readonly status: number;
    readonly payload?: unknown;
    constructor(status: number, message: string, payload?: unknown);
}
//# sourceMappingURL=http-error.d.ts.map