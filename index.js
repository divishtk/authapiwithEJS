import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

app.listen(process.env.PORT || PORT, (req, res) => {
  console.log(
    `App is running on phase ${process.env.DEV_MODE} ON PORT ${
      process.env.PORT || PORT
    }`
  );
});
