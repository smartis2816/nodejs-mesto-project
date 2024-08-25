import { Request, Response } from 'express';
import User from '../models/user';


export const getUsers = (req: Request, res: Response) => {
  return User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.id;
  return User.findById(id)
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(400).send({ message: 'Произошла ошибка валидации'});
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
  .then(user => res.status(201).send({ data: user }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(400).send({ message: 'Произошла ошибка валидации'});
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
}

export const updateUser = (req: Request, res: Response) => {
  const id = res.locals.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    id, { name, about }, { new: true, runValidators: true }
  )
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(400).send({ message: 'Произошла ошибка валидации'});
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
}

export const updateUserAvatar = (req: Request, res: Response) => {
  const id = res.locals.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    id, { avatar }, { new: true, runValidators: true }
  )
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(400).send({ message: 'Произошла ошибка валидации'});
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
}