import {NextFunction, Request, Response} from "express";
import {getConnection, Repository} from "typeorm";
import {User} from "../entities/User";
import {sendRate} from "../mailer/Mailer";

class UserController {
  static listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results: User[] = await getConnection().getRepository(User).find({select: ["username", "role", "name", "email"]});

      res.send(results);
    }
    catch (e) {
      res.status(500).send();
    }
  }

  static listById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await getConnection().getRepository(User).findOne({
        select: ["username", "role", "name", "email"],
        where: {id: req.params.id}
      });

      if (!results)
        res.status(400).send();

      res.send(results);
    }
    catch (e) {
      res.status(500).send();
    }

  }

  static listUserUrls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await getConnection().getRepository(User)
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.urls", "urls")
          .where("user.id = :id", {id: req.res.locals.jwtPayload.userId})
          .orderBy("visits", "DESC")
          .limit(10)
          .getOne();

      if (!results)
        res.status(400).send();

      res.send(results);
    }
    catch (e) {
      res.status(500).send();
    }

  }

  static profile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await getConnection().getRepository(User).findOne({
        select: ["username", "role", "name", "email"],
        where: {username: req.res.locals.jwtPayload.username}
      });

      if (!results)
        res.status(400).send();

      res.send(results);
    }
    catch (e) {
      res.status(500).send();
    }

  }

  static listOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await getConnection().getRepository(User).findOneOrFail({
        relations: ["urls"],
        select: ["id", "username", "role", "urls", "email"],
        where: {username: req.res.locals.jwtPayload.username}
      });

      if (!results)
        res.status(400).send();

      res.send(results);
    }
    catch (e) {
      res.status(500).send();
    }

  }

  static createOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = new User();
      const {username, password, name, email} = req.body;

      if (!(username && password)){
        res.status(400).send();
      }

      user.username = username;
      user.password = password;
      user.name = name;
      user.email = email;
      user.role = "admin";
      user.hashPassword();

      const repository: Repository<User> = await getConnection().getRepository(User);
      repository.save(user);

      res.send();
    }
    catch (e) {
      res.status(500).send();
    }
  }

  static deleteOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
     const repository: Repository<User> = getConnection().getRepository(User);

     await repository.delete(req.params.id)
       .then(
         r => {
           if (!(r.affected > 0)) res.status(400).send();
         }
       )
       .catch(e => res.status(500).send)
     ;

     res.send();
   }
   catch (e) {
     res.status(500).send();
   }
  }

  static updateOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
     const repository: Repository<User> = getConnection().getRepository(User);
     const user = await repository.findOne({where: {id: res.locals.jwtPayload.userId}});

     if(!user)
       res.status(400).send();

     if (!(req.body.name || req.body.email))
       res.status(400).send();

     if (req.body.name) user.name = req.body.name;

     if (req.body.email) user.email = req.body.email;

     repository.save(user);

     res.send();
   }
   catch (e) {
     res.status(500).send();
   }
  }

  static rate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {rate, comment} = req.body;
      const user = await getConnection().getRepository(User).findOne({where: {id: res.locals.jwtPayload.userId}});

      sendRate(rate, comment, user.name);

      console.log(rate, comment, user);
      res.send();
    }
    catch (e) {
      res.status(500).send();
    }
  }

  static newPass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {password, newPassword} = req.body;
      const repository: Repository<User> = getConnection().getRepository(User);

      try {
        const user = await repository.findOneOrFail({where: {id: res.locals.jwtPayload.userId}});

        if (!user.checkIfUnencryptedPasswordIsValid(password)) res.status(401).send();
        else {
          user.password = newPassword;
          user.hashPassword();

          repository.save(user);

          res.send();
        }
      } catch (e) {
        res.status(400).send();
      }
    }
    catch (e) {
      res.status(500).send();
    }
  }
}

export default UserController;
