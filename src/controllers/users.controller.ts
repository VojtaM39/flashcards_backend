import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';
import UserService from '@services/users.service';

class UsersController {
  public userService = new UserService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
