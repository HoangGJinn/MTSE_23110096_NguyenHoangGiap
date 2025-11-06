import bodyParser from "body-parser";
import express from "express";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
const connect = require("./config/configdb");
require("dotenv").config();

let app = express();

// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);
initWebRoutes(app);
connect();

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Backend nodejs is running on the port: " + port);
});
