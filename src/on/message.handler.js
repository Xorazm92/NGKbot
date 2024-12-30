import bot from "../config/bot.js";
import { Keyboard } from "grammy";
import User from "../models/user.js";
import { handleComplaint, processComplaint } from '../handlers/common.handlers.js';

bot.command("start", async (ctx) => {
    const keyboard = new Keyboard()
        .text("📝 Shikoyat va takliflar")
        .row()
        .text("⬅️ Orqaga")
        .resized();

    await ctx.reply("Assalomu alaykum! Botimizga xush kelibsiz.", {
        reply_markup: keyboard
    });
});

bot.hears("📝 Shikoyat va takliflar", async (ctx) => {
    const user = await User.findOne({ user_id: ctx.from.id });
    const lang = user?.user_lang || 'UZB';
    await handleComplaint(ctx, lang);
});

bot.hears("❌ Bekor qilish", async (ctx) => {
    const userId = ctx.from.id;
    if (complaintSteps[userId]) {
        delete complaintSteps[userId];
        const keyboard = new Keyboard()
            .text("📝 Shikoyat va takliflar")
            .row()
            .text("⬅️ Orqaga")
            .resized();

        await ctx.reply("Murojaat bekor qilindi.", {
            reply_markup: keyboard
        });
    }
});

bot.on("message:text", async (ctx) => {
    const user = await User.findOne({ user_id: ctx.from.id });
    const lang = user?.user_lang || 'UZB';
    
    const processed = await processComplaint(ctx, lang);
    if (processed) return;
    
    // Default case - no match found
    console.log("Default holatga o'tish, no match found");
});
