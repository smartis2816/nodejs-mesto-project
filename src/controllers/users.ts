import { Request, Response } from 'express';
import User from '../models/user';


export const getUsers = (req: Request, res: Response) => {
  return User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({ message: 'Передан некорректный _id пользователя' });
  }
  return User.findById(id)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    res.send({ data: user })
  })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
  }
  return User.create({ name, about, avatar })
  .then(user => res.status(201).send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const updateUser = (req: Request, res: Response) => {
  const id = res.locals.user._id;
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
  }
  return User.findByIdAndUpdate(id, { name, about })
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    res.send({ data: user })
  })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

}

export const updateUserAvatar = (req: Request, res: Response) => {
  const id = res.locals.user._id;
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
  }
  return User.findByIdAndUpdate(id, { avatar })
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    res.send({ data: user })
  })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

}