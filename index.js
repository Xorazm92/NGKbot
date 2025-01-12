import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import routes from './src/routes/index.js'
import { bot } from "./src/config/bot.js"
import "./src/on/action.handler.js"
import { adminCommands } from './src/handlers/admin.handlers.js';

config()

const app = express()
app.use(express.json())
app.use("/api/v1", routes)

// Admin commands
bot.command(["add_literature", "add_literatura"], async (ctx) => {
    console.log("Add literature command received");
    if (!ctx.session?.isAdmin) {
        return ctx.reply("Bu buyruq faqat adminlar uchun!");
    }
    return adminCommands.addLiterature(ctx);
});

bot.command(["list_literature", "list_literatura"], async (ctx) => {
    console.log("List literature command received");
    if (!ctx.session?.isAdmin) {
        return ctx.reply("Bu buyruq faqat adminlar uchun!");
    }
    return adminCommands.listLiterature(ctx);
});

bot.command(["delete_literature", "delete_literatura"], async (ctx) => {
    console.log("Delete literature command received");
    if (!ctx.session?.isAdmin) {
        return ctx.reply("Bu buyruq faqat adminlar uchun!");
    }
    return adminCommands.deleteLiterature(ctx);
});

// Handle text messages for admin actions
bot.on('message:text', async (ctx) => {
    if (ctx.session?.adminAction) {
        switch (ctx.session.adminAction) {
            case 'waitingForSection':
            case 'waitingForFile':
                return adminCommands.addLiterature(ctx);
            case 'deleteLiterature':
                return adminCommands.deleteLiterature(ctx);
            default:
                ctx.session.adminAction = null;
        }
    }
});

// Handle document and video messages for admin actions
bot.on('message:document', async (ctx) => {
    if (ctx.session?.adminAction === 'waitingForFile') {
        return adminCommands.addLiterature(ctx);
    }
});

bot.on('message:video', async (ctx) => {
    if (ctx.session?.adminAction === 'waitingForFile') {
        return adminCommands.addLiterature(ctx);
    }
});

const port = process.env.PORT || 5016
const dbUrl = process.env.DATABASE_URI

mongoose.connect(dbUrl)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            bot.start();
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
