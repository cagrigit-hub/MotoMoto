import AppError from "./app-error";

export class CustomError extends AppError {
  constructor() {
    super("Something went wrong", 500);
  }
}