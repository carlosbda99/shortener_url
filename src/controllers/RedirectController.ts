import {Handler, NextFunction, Request, Response} from "express";
import {getConnection, Repository} from "typeorm";
import {User} from "../entities/User";
import {ShortingURL} from "../entities/ShortingURL";

class RedirectController {
  static redirectTo: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository: Repository<User> = getConnection().getRepository(User);
    const urlRepository: Repository<ShortingURL> = getConnection().getRepository(ShortingURL);

    const user: User = await userRepository.findOne(req.params.userId);
    const url: ShortingURL = await urlRepository.findOne(
      {
        where: {urlShortened: req.params.url},
        relations: ["user"]
      }
    );

    url.visits += 1;
    urlRepository.save(url);

    if (user && url.user.id === user.id){
      res.redirect(`${url.url}`);
    }
  }
}

export default RedirectController;
