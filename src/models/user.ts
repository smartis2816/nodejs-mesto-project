import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const urlExp = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [200, 'Максимальная длина поля "about" - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (value: any) => urlExp.test(value),
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    validate: {
      validator: (value: any) => validator.isEmail(value),
      message: 'Некорректный email',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
},
{
  versionKey: false
});

export default mongoose.model<IUser>('User', UserSchema);