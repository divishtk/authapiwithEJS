import express from "express";
import bodyParser from "body-parser"; // For parsing JSON bodies
import cookieParser from "cookie-parser";


const app = express();
app.use(express.static("./assets"));

app.set('view engine','ejs');
app.set('views','./views')

app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(
    express.json()
  );
  app.use(cookieParser());
  app.use(bodyParser.json());

export {app}