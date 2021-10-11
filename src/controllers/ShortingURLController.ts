import {NextFunction, Request, Response} from "express";
import {getConnection, Repository} from "typeorm";
import {ShortingURL} from "../entities/ShortingURL";
import {User} from "../entities/User";

class ShortingURLController {
  static listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results: ShortingURL[] = await getConnection().getRepository(ShortingURL).find({
        relations: ["user"],
        select: ["url", "urlShortened",
          "visits", "user"]
      });

      res.send(results);
    }
    catch (e) {
      res.status(500).send();
    }
  }

  static listById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await getConnection().getRepository(ShortingURL).findOne({
        select: ["url", "urlShortened"],
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

  static listOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await getConnection().getRepository(ShortingURL).findOne({
        select: ["url", "urlShortened", "visits"],
        where: {id: req.body.id}
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
      const url: ShortingURL = new ShortingURL();
      const repository: Repository<ShortingURL> = await getConnection().getRepository(ShortingURL);
      const userRepository: Repository<User> = await getConnection().getRepository(User);

      const user: User = await userRepository.findOne(req.res.locals.jwtPayload.userId);

      if (!(req.body.url)){
        res.status(400).send();
      }

      url.url = req.body.url;
      url.user = user;
      url.shortenUrl();

      repository.save(url).then(result => {
        res.send(result);
      }).catch(e => res.status(500).send(e));
    }
    catch (e) {
      res.status(500).send();
    }
  }

  static deleteOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const repository: Repository<ShortingURL> = getConnection().getRepository(ShortingURL);

      await repository.delete(req.params.id)
        .then(
          r => {
            if (!(r.affected > 0)) res.status(400).send();
          }
        )
        .catch(e => res.status(500).send());

      res.send();
    }
    catch (e) {
      res.status(500).send();
    }
  }

  static updateOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const repository: Repository<ShortingURL> = getConnection().getRepository(ShortingURL);
      const url = await repository.findOne({where: {id: req.params.id}});

      if(!url)
        res.status(400).send();

      if (!req.body.name)
        res.status(400).send();

      url.url = req.body.url;
      url.shortenUrl();
      repository.save(url);

      res.send();
    }
    catch (e) {
      res.status(500).send();
    }
  }
}

export default ShortingURLController;
