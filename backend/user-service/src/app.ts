// app.ts or server.js
import express from 'express';
import 'express-async-errors'; // Import express-async-errors before defining routes
import { errorHandlerMiddleware } from '@cakitomakito/moto-moto-common';

import refreshRoute from './routes/refresh-route';
import userRoute from './routes/user-route';
import licenseRoute from './routes/license-route';

const app = express();

app.use(express.json());


// Define your middleware and routes here



const VERSION = 'v1';
const prefix = `/api/${VERSION}`;

// mount routes
app.use(`${prefix}/users`, userRoute); // Mount the user route at `/api/v1/users`
app.use(`${prefix}/licenses`, licenseRoute); // Mount the license route at `/api/v1/licenses`
app.use(`${prefix}/refresh`, refreshRoute); // Mount the refresh route at `/api/v1/refresh`


// Apply error handler middleware
app.use(errorHandlerMiddleware);

export default app;