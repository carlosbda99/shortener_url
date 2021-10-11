import {Router} from "express";
import AuthController from "../controllers/AuthController";
import checkJWT from "../middlewares/JwtChecker";

const authRouter: Router = Router();

authRouter.post("/auth/login", AuthController.login);
authRouter.post("/auth/reset-password", AuthController.forgotPass);
authRouter.get("/auth/logged", [checkJWT], AuthController.logged);

export default authRouter;
