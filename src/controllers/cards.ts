import e, { Request, Response } from 'express';
import Card from '../models/card';


export const getCards = (req: Request, res: Response) => {
  return Card.find({})
  .then(cards => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = res.locals.user._id;
  return Card.create({ name, link, owner })
  .then(card => res.status(201).send({ data: card }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(400).send({ message: 'Произошла ошибка валидации'});
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
};

export const deleteCard = (req: Request, res: Response) => {
  const { id } = req.params;
  return Card.findByIdAndDelete(id)
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(400).send({ message: 'Произошла ошибка валидации'});
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
}

export const likeCard = (req: Request, res: Response) => {
  const id = res.locals.user._id;
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } }, {new: true})
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(400).send({ message: 'Произошла ошибка валидации'});
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
}

export const dislikeCard = (req: Request, res: Response) => {
  const id = res.locals.user._id;
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } }, {new: true})
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(400).send({ message: 'Произошла ошибка валидации'});
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
}


