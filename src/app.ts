import express from 'express';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import helmet from 'helmet';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from './errors/not-found-err';
import errorHandler from './errors/error-handler';
import { userValidation, loginValidation } from './middlewares/validation';

export interface AuthUser {
  user: {
    _id: string;
  }
}

const DB_URL = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect(DB_URL);

app.use(helmet());

app.use(requestLogger);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);

app.use(errorLogger);
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorHandler);

app.listen(PORT);
