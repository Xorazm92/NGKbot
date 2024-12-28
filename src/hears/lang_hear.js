import bot from "../config/bot.js";
import { saveLang, selectLang } from "../handlers/lang.handler.js";

bot.hears("🇺🇿 O'zbek tili", async (ctx) => {
  await saveLang(ctx, "UZB");
});

bot.hears("🇷🇺 Русский", async (ctx) => {
  await saveLang(ctx, "RUS");
});

bot.hears("♻️ Tilni o'zgartirish", async (ctx) => {
  console.log("error");
  await selectLang(ctx);
});

bot.hears("♻️ Изменить язык", async (ctx) => {
  console.log("error");
  await selectLang(ctx);
});
