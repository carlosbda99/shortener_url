import {Router} from "express";
import ShortingURLController from "../controllers/ShortingURLController";
import checkJWT from "../middlewares/JwtChecker";

const urlRouter: Router = Router();

urlRouter.use("/urls", [checkJWT]);

urlRouter.get("/urls/detail", ShortingURLController.listOne);
urlRouter.get("/urls/:id", ShortingURLController.listById);
urlRouter.patch("/urls/:id", ShortingURLController.updateOne);
urlRouter.delete("/urls/:id", ShortingURLController.deleteOne);
urlRouter.get("/urls", ShortingURLController.listAll);
urlRouter.post("/urls", ShortingURLController.createOne);

export default urlRouter;
