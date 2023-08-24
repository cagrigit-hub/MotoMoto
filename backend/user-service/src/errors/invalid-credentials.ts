import AppError from "./app-error";

class InvalidCredentials extends AppError {
  constructor(message = "Invalid credentials") {
    super(message, 401);
  }
}

export default InvalidCredentials;
