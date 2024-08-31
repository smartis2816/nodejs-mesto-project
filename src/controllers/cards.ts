import e, { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import ValidationError from '../errors/validation-err';
import NoAccessError from '../errors/no-access-err';
import NotFoundError from '../errors/not-found-err';


export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return Card.find({})
  .then(cards => res.send({ data: cards }))
  .catch(next);
}

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = res.locals.user._id;
  return Card.create({ name, link, owner })
  .then(card => res.status(201).send({ data: card }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      return next(new ValidationError('Произошла ошибка валидации'));
    } else {
      return next(err);
    }
  });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
  .then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    if (card?.owner.toString() !== res.locals.user._id) {
      return next(new NoAccessError('Нельзя удалить чужую карточку'));
    }
    card?.deleteOne();
    return res.send({ data: card })
  })
  .catch((err) => {
    if (err.name == 'ValidationError') {
      return next(new ValidationError('Произошла ошибка валидации'));
    } else {
      return next(err);
    }
  });
}

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const id = res.locals.user._id;
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } }, {new: true})
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      return next(new ValidationError('Произошла ошибка валидации'));
    } else {
      return next(err);
    }
  });
}

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const id = res.locals.user._id;
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } }, {new: true})
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      return next(new ValidationError('Произошла ошибка валидации'));
    } else {
      return next(err);
    }
  });
}


