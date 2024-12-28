import {Bot} from "grammy"
import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import routes from './src/routes/index.js'
import "./src/config/bot.js"
import "./src/on/action.handler.js"

config()

const app = express()

app.use(express.json())
app.use("/api/v1", routes)

const port =  process.env.PORT || 5005
const dbUrl = process.env.DATABASE_URI

app.listen(port, async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connect to MongoDB");
        console.log("Project is running on port:" + port);
    } catch (error) {
        console.log(Error);
    }
})
