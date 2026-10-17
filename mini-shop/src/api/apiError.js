export class ApiError extends Error {
    constructor(status, message, originalError = null) {
        super(message);
        this.name = 'apiError';
        this.status = status || 500;
        this.message = message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau!'
        this.originalError = originalError;
    }
}