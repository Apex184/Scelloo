export const ErrorMessage = {
    Unauthenticated: 'You are not authenticated',
    Unauthorized: 'You are not authorized to perform this action',
    InvalidCredentials: 'Invalid email or password',
    UserNotFound: 'User not found',
    TaskNotFound: 'Task not found',
    InvalidInput: 'Invalid input data',
    ServerError: 'Internal server error',
    EmailExists: 'Email already exists',
    InvalidToken: 'Invalid or expired token',
    InvalidRequestParameters: 'Invalid request parameter(s)'
} as const;

export const ResponseMessage = {
    UserSignu: "User signup successfully"
} as const; 
