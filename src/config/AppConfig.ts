import express, {Application, Router} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "../routers/UserRouter";
import helmet from "helmet";
import urlRouter from "../routers/ShortingURLRouter";
import authRouter from "../routers/AuthRoute";
import redirectRouter from "../routers/RedirectingRoute";
import morgan from "morgan";

const routers: Router[] = [userRouter, urlRouter, authRouter];

const app: Application = express();
app.use(cors());
app.use(morgan('short'));
app.use(helmet());
app.use(bodyParser.json());

app.use("/shortener", [redirectRouter]);
app.use("/api/v1", routers);

export default app;
