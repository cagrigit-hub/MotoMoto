import express from "express";
import 'express-async-errors'; // Import express-async-errors before defining routes
import { errorHandlerMiddleware } from '@cakitomakito/moto-moto-common';
import motorRoute from "./routes/motor-route";
const app = express();

app.use(express.json());


const VERSION = 'v1';
const prefix = `/api/${VERSION}`;

// routes will be here
app.use(`${prefix}/motorcycles`,motorRoute);

app.use(errorHandlerMiddleware);

export default app;