// app.ts or server.js
import express from 'express';
import 'express-async-errors'; // Import express-async-errors before defining routes
import { errorHandlerMiddleware } from './middlewares/error-handler-middleware';

const app = express();

// Define your middleware and routes here

// Apply error handler middleware
app.use(errorHandlerMiddleware);


export default app;