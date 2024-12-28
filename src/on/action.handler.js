import bot from "../config/bot.js";
import {
  userSection,
  requestsSection,
  literatureSection,
  messagesSection,
  selectLang,
  saveLang,
  sendHomeMenu
} from "../handlers/menu.handlers.js";
import {
  handleInterestingMaterials,
  handleVideoTutorials,
  handleSamplefarms,
  handleRequiredDocuments,
  handleComplaintsAndSuggestions,
  handleCallCenter
} from "../handlers/common.handlers.js";
import User from "../models/user.js";
import { Keyboard } from "grammy";

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim(); 
  console.log("Received text:", text);  
  const user_id = ctx.update.message.from.id;

  let user = await User.findOne({ user_id });

  if (!user) {
    const newUser = new User({
      user_id: user_id,
      username: ctx.from.username || "",
      first_name: ctx.from.first_name || "",
      last_name: ctx.from.last_name || "",
    });

    await newUser.save();
    return await selectLang(ctx);
  }

  const lang = user?.user_lang || "UZB"; 

  if (text === "🇺🇿 O'zbek tili") {
    await saveLang(ctx, "UZB");
    return await sendHomeMenu(ctx, "UZB");
  } else if (text === "🇷🇺 Русский") {
    await saveLang(ctx, "RUS");
    return await sendHomeMenu(ctx, "RUS");
  }

  switch (text) {
    case "🗃️ Adabiyotlar":
    case "🗃 Литература":
      console.log("Adabiyotlar bo'limiga o'tish");
      await literatureSection(ctx, lang);
      break;

    case "📚 Qiziqarli ma'lumotlar":
    case "📚 Интересные данные":
      await handleInterestingMaterials(ctx, lang);
      break;

    case "📹 Video qo'llanmalar":
    case "📹 Видео-руководства":
      await handleVideoTutorials(ctx, lang);
      break;

    case "📝 Namunaliy blanklar":
    case "📝 Образцы бланков":
      await handleSamplefarms(ctx, lang);
      break;

    case "📄 Kerakli hujjatlar":
    case "📄 Необходимые документы":
      await handleRequiredDocuments(ctx, lang);
      break;

    case "📝 Shikoyat va takliflar":
    case "📝 Жалобы и предложения":
      await handleComplaintsAndSuggestions(ctx, lang);
      break;

    case "📞 Telefon raqamlar":
    case "📞 Телефонные номера":
      await handleCallCenter(ctx, lang);
      break;

    case "🧑‍🤝‍🧑 Foydalanuvchi ro'yxati":
    case "🧑‍🤝‍🧑 Список пользователей":
      await ctx.reply(
        lang === "UZB" 
          ? "Foydalanuvchilar ro'yxati tez orada qo'shiladi."
          : "Список пользователей будет добавлен в ближайшее время."
      );
      break;

    case "📣 Xabarlar":
    case "📣 Сообщения":
      console.log("Xabarlar bo'limiga o'tish");
      await messagesSection(ctx, lang);
      break;

    case "📬 Yangi xabarlar":
    case "📬 Новые сообщения":
      await ctx.reply(
        lang === "UZB" 
          ? "Yangi xabarlar tez orada qo'shiladi."
          : "Новые сообщения будут добавлены в ближайшее время."
      );
      break;

    case "📨 Barcha xabarlar":
    case "📨 Все сообщения":
      await ctx.reply(
        lang === "UZB" 
          ? "Barcha xabarlar tez orada qo'shiladi."
          : "Все сообщения будут добавлены в ближайшее время."
      );
      break;

    case "🪧 Murojaatlar":
    case "🪧 Запросы":
      console.log("Murojaatlar bo'limiga o'tish");
      await requestsSection(ctx, lang);
      break;

    case "📋 Murojaatlar haqida":
    case "📋 О запросах":
      await ctx.reply(
        lang === "UZB" 
          ? "Murojaatlar haqida ma'lumot tez orada qo'shiladi."
          : "Информация о запросах будет добавлена в ближайшее время."
      );
      break;

    case "🧑🏾‍🤝‍🧑🏾 Foydalanuvchilar":
    case "🧑🏾‍🤝‍🧑🏾 Пользователи":
      console.log("Foydalanuvchilar bo'limiga o'tish");
      await userSection(ctx, lang);
      break;

    case "♻️ Tilni o'zgartirish":
    case "♻️ Изменить язык":
      console.log("Tilni o'zgartirish bo'limiga o'tish");
      await selectLang(ctx);
      break;

    case "⬅️ Orqaga":
    case "⬅️ Назад":
      console.log("Orqaga bo'limiga o'tish");
      await sendHomeMenu(ctx, lang);
      break;

    default:
      console.log("Default holatga o'tish, no match found");
      await ctx.reply(
        lang === "UZB"
          ? "❌ Mavjud bo'lmagan buyruq. Iltimos, menyudan tanlang."
          : "❌ Неизвестная команда. Пожалуйста, выберите из меню."
      );
      await sendHomeMenu(ctx, lang);
      break;
  }
});
