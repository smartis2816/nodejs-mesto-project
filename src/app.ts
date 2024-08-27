import express from 'express';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import helmet from 'helmet';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import winston from 'winston';
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from 'errors/not-found-err';

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
app.post('/signin', login);
app.post('/signup', createUser);

app.use(errorLogger);
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError('Запрашиваемый ресурс не найден'));
});


app.listen(PORT);
