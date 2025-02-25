import dotenv from "dotenv";
import { app } from "./app.js";
import mongoConnect from "./DB/mongo.db.js";

dotenv.config();

mongoConnect().then(()=>{
    console.log("MongoDB Connected!!");
    app.listen(process.env.PORT || PORT,(req,res)=>{
        console.log(`App is running on phase ${process.env.DEV_MODE} ON PORT ${process.env.PORT || PORT}`);
    })
}).catch((err)=>{
    console.log("Connection issue", err);
    process.exit(1);
});