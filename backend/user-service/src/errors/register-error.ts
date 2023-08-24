import AppError from "./app-error";

class RegisterError extends AppError {
    constructor(message = "Register failed") {
        super(message, 401);
    }
}

export default RegisterError;