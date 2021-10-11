import {Handler, NextFunction, Request, Response} from "express";
import {getConnection, Repository} from "typeorm";
import {User} from "../entities/User";

const checkRole = (roles: string[]): Handler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwtPayload.userId;

    const repository: Repository<User> = getConnection().getRepository(User);

    let user: User;

    try {
      user = await repository.findOneOrFail(id);
    }
    catch (e) {
      res.status(401).send();
    }

    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};

export default checkRole;
