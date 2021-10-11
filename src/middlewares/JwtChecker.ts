import {Handler, NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import environment from "../config/EnvironmentConfig";

const checkJWT: Handler = (req: Request, res: Response, next:NextFunction): void => {
  const token: string = req.headers.authorization as string;

  let jwtPayload: string | jwt.JwtPayload;

  try {
    jwtPayload = jwt.verify(token, environment.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
  }
  catch (e) {
    res.status(401).send();
    return;
  }

  next();
};

export default checkJWT;
