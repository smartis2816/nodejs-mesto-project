import express from 'express';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import helmet from 'helmet';

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
app.use((req: Request, res: Response<unknown, AuthUser>, next: NextFunction) => {
  res.locals.user = {
    _id: '66c98c941a1c38e07af44452',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) =>
  res.send(
    { message: 'Запрашиваемый ресурс не найден' }
  )
);

app.listen(PORT);
