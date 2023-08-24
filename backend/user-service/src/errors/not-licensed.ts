import AppError from "./app-error";

class NotLicensed extends AppError {
    constructor(message = "Not licensed") {
        super(message, 401);
    }
}

export default NotLicensed;