import NoAuthorizationError from '../errors/no-authorization-err';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtKey } from '../config/config';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NoAuthorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    return next(new NoAuthorizationError('Необходима авторизация'));
  }
  res.locals.user = payload;

  return next();
};

export default auth;