import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}


const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    required: [true, 'Поле "name" должно быть заполнено']
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [200, 'Максимальная длина поля "about" - 30'],
    required: [true, 'Поле "about" должно быть заполнено']
  },
  avatar: {
    type: String,
    validate: {
      validator: (value: any) => validator.isURL(value),
      message: 'Некорректный URL',
    },
    required: [true, 'Поле "avatar" должно быть заполнено']
  }
},
{
  versionKey: false
});

export default mongoose.model<IUser>('User', UserSchema);