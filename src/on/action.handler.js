import bot from "../config/bot.js";
import {
  userSection,
  requestsSection,
  literatureSection,
  messagesSection,
  selectLang,
  saveLang,
  sendHomeMenu
} from '../handlers/menu.handlers.js';

import {
  handleStart,
  handleLanguage,
  handleMenu,
  handleBack,
  handleRequiredDocuments,
  handleCallCenter,
  handleNewMessages,
  handleInterestingMaterials,
  handleVideoTutorials,
  handleSamplefarms,
  handleAllNews,
  handleComplaint,
  handleComplaintCallback,
  processComplaint,
  complaintSteps
} from '../handlers/common.handlers.js';

import { getTranslation } from '../utils/common.js';
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
      console.log("Shikoyat va takliflar bo'limiga o'tish");
      await handleComplaint(ctx, lang);
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
      await handleNewMessages(ctx, lang);
      break;

    case "📰 Barcha xabarlar":
    case "📰 Все сообщения":
      console.log("Barcha xabarlar tugmasi bosildi");
      await handleAllNews(ctx, lang);
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
      if (user?.state === 'waiting_complaint') {
        delete complaintSteps[user_id]; // Reset complaint state
        return;
      }
      break;

    default:
      console.log("Default holatga o'tish, no match found");
      if (user?.state === 'waiting_complaint') {
        await processComplaint(ctx, lang);
        return;
      }
      await ctx.reply(
        lang === "UZB"
          ? "❌ Mavjud bo'lmagan buyruq. Iltimos, menyudan tanlang."
          : "❌ Неизвестная команда. Пожалуйста, выберите из меню."
      );
      await sendHomeMenu(ctx, lang);
      break;
  }
});

// Barcha xabarlar tugmasi bosilganda
bot.hears("📰 Barcha xabarlar", async (ctx) => {
  console.log("Barcha xabarlar tugmasi bosildi");
  await handleAllNews(ctx, "UZB");
});

bot.hears("📰 Все сообщения", async (ctx) => {
  console.log("Нажата кнопка Все сообщения");
  await handleAllNews(ctx, "RUS");
});

// Shikoyat bo'limi uchun handler
bot.hears("📝 Shikoyat va takliflar", async (ctx) => {
  console.log("Shikoyat va takliflar bo'limiga o'tish");
  const user_id = ctx.from.id;
  const user = await User.findOne({ user_id });
  const lang = user?.user_lang || 'UZB';
  await handleComplaint(ctx, lang);
});

bot.on("callback_query:data", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  
  // Shikoyatlar uchun callbacklar
  if (callbackData.startsWith('approve_complaint=') || callbackData.startsWith('reject_complaint=')) {
    await handleComplaintCallback(ctx);
    return;
  }

  const user_id = ctx.callbackQuery.from.id;
  const data = await User.find({ user_id });
  const user = data?.[0];
  const lang = user.user_lang;

  // rest of the existing callback handling code ...
});
