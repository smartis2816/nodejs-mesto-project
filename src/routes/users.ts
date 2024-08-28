import { Router } from 'express';
import { getUsers, getUserById, updateUser, updateUserAvatar, getCurrentUser } from '../controllers/users';
import { avatarValidation, userIdValidation, userDefinitionValidation } from '../middlewares/validation';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', userIdValidation, getUserById);
router.get('/me', getCurrentUser);
router.patch('/me', userDefinitionValidation, updateUser);
router.patch('/me/avatar', avatarValidation, updateUserAvatar);


export default router;
