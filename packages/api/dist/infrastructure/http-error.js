export class HttpError extends Error {
    status;
    payload;
    constructor(status, message, payload) {
        super(message);
        this.status = status;
        this.payload = payload;
    }
}
//# sourceMappingURL=http-error.js.map