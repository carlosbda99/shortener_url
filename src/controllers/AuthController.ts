import {Handler, NextFunction, Request, Response} from "express";
import {getConnection, Repository} from "typeorm";
import environment from "../config/EnvironmentConfig";
import * as jwt from "jsonwebtoken";
import {User} from "../entities/User";
import generator from "generate-password";
import {sendNewPass} from "../mailer/Mailer";

class AuthController {
  static login: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const {username, password} = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    const userRepository: Repository<User> = getConnection().getRepository(User);
    let user: User;

    try{
      user = await userRepository.findOneOrFail({where: {username}});

    } catch (error) {
      res.status(401).send();
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)){
      res.status(401).send();
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      environment.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res.json(token);
  }

  static logged = async (req: Request, res: Response, next: NextFunction) => {
    const {username, userId} = res.locals.jwtPayload;

    if (!!username && !!userId) res.status(200).send();
    else res.status(401).send();
  }

  static forgotPass = async (req: Request, res: Response, next: NextFunction) => {
    const {username, email} = req.body;

    if (!!username && !! email) {
      const repository: Repository<User> = getConnection().getRepository(User);

      try {
        const user: User = await repository.findOneOrFail({where: {username, email}});
        const newPassword: string = generator.generate({
          length: 10,
          numbers: true
        });
        user.password = newPassword;

        user.hashPassword();

        repository.save(user);

        sendNewPass(newPassword, user.name, user.email);

        res.send();
      }
      catch (e) {
        res.status(400).send();
      }
    } else res.status(400).send();

  }
}

export default AuthController;
