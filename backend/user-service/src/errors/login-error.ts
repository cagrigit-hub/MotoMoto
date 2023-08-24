import AppError from "./app-error";

class LoginError extends AppError {
    constructor(message = "Login failed") {
        super(message, 401);
    }
}

export default LoginError;