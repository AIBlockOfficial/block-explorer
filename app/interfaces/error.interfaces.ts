/* -------------------------------------------------------------------------- */
/*                           Internal Module Errors                           */
/* -------------------------------------------------------------------------- */

export enum IErrorAll {
    IErrorInternal,
    IErrorNetwork,
}

// Network Error Types
export enum IErrorNetwork {
    InternalServerError = 'Internal Server Error',
    InvalidRequestBody = 'Invalid request body',
    InternalError = 'Internal Error',
    Unauthorized = 'Unauthorized',
    MethodNotFound = 'Method not found',
    MethodNotAllowed = 'Method not allowed',
}

// Internal module error
export enum IErrorInternal {
    ExportError = 'Export Error',
    UnknownError = 'Unknown Error',
}