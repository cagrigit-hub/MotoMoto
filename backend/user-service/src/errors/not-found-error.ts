import AppError from "./app-error";

class NotFound extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export default NotFound;