import app from "./config/AppConfig";
import {createConnection} from "typeorm";
import environment from "./config/EnvironmentConfig";

createConnection().then( () => {
  app.listen(environment.PORT, () => {
    console.log(`Running server on port ${environment.PORT}`);
  });
});
