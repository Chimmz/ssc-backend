import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from './controllers/errorController/globalErrorHandler';
import userRouter from './routes/userRouter';

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.use('/api/v1/users', userRouter);

// Rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mintues
  max: 500,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter); // Limit requests to 500 request per 10 mins.

// Defining an error handler for the entire application should always stay under routes.
app.use(globalErrorHandler);

export default app;
