import AppError from "./app-error";

class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

export default ServerError;
