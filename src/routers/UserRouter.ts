import {Router} from "express";
import UserController from "../controllers/UserController";
import checkJWT from "../middlewares/JwtChecker";

const userRouter: Router = Router();

userRouter.use("/users", [checkJWT]);

userRouter.get("/users/profile", UserController.profile);
userRouter.get("/users/detail", UserController.listOne);
userRouter.get("/users/urls", UserController.listUserUrls);
userRouter.post("/users/rate", UserController.rate);
userRouter.post("/users/new-password", UserController.newPass);
userRouter.get("/users/:id", UserController.listById);
userRouter.delete("/users/:id", UserController.deleteOne);
userRouter.patch("/users", UserController.updateOne);
userRouter.get("/users", UserController.listAll);

userRouter.post("/signup", UserController.createOne);

export default userRouter;
