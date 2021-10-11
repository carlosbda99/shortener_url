import {Router} from "express";
import RedirectController from "../controllers/RedirectController";

const redirectRouter: Router = Router();

redirectRouter.get("/:userId/:url", RedirectController.redirectTo);

export default redirectRouter;
