import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ValidationError from '../errors/validation-err';
import NoAuthorizationError from '../errors/no-authorization-err';
import AlreadyExistsError from '../errors/already-exists';
import { jwtKey } from '../config/config';


export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);
}

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  return User.findById(userId)
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      return next(new ValidationError('Произошла ошибка валидации'));
    } else {
      return next(err);
    }
  });
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10)
  .then (hash => User.create({ name, about, avatar, email, password: hash }))
  .then(user => {
    const {password, ...userWithoutPassword} = user.toObject();
    res.status(201).send({ data: userWithoutPassword })
  })
  .catch((err) => {
    if (err.name == 'ValidationError') {
      return next(new ValidationError('Произошла ошибка валидации'));
    } if (err.code === 11000) {
      return next(new AlreadyExistsError('Пользователь с таким email уже существует'));
    } else {
      return next(err);
    }
  });
}

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const id = res.locals.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    id, { name, about }, { new: true, runValidators: true }
  )
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      return next(new ValidationError('Произошла ошибка валидации'));
    } else {
      return next(err);
    }
  });
}

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const id = res.locals.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    id, { avatar }, { new: true, runValidators: true }
  )
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      return next(new ValidationError('Произошла ошибка валидации'));
    } else {
      return next(err);
    }
  });
}

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
  .then((user) => {
    if (!user) {
      return Promise.reject(new NoAuthorizationError('Неправильные почта или пароль'));
    }
    return bcrypt.compare(password, user.password)
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new NoAuthorizationError('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        jwtKey,
        { expiresIn: '7d' }
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true
      });
      return res.send({ token });
    })
  })
  .catch(next);
}

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = res.locals.user._id;
  return User.findById(id)
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      return next(new ValidationError('Произошла ошибка валидации'));
    } else {
      return next(err);
    }
  });
};