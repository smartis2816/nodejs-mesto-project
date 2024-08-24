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
  if (!name || !link) {
    return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
  }
  return Card.create({ name, link, owner })
  .then(card => res.status(201).send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const deleteCard = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ message: 'Передан некорректный _id карточки' });
  };
  return Card.findByIdAndDelete(id)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    res.send({ data: card })
  })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const likeCard = (req: Request, res: Response) => {
  const id = res.locals.user._id;
  if (!id) {
    return res.status(400).send({ message: 'Передан некорректный _id карточки' });
  };
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } }, {new: true})
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    res.send({ data: card })
  })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

}

export const dislikeCard = (req: Request, res: Response) => {
  const id = res.locals.user._id;
  if (!id) {
    return res.status(400).send({ message: 'Передан некорректный _id карточки' });
  };
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } }, {new: true})
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    res.send({ data: card })
  })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}


