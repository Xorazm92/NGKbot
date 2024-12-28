import { Keyboard } from "grammy";
import User from "../models/user.js";

// **Tilni tanlash funksiyasi**
export const selectLang = async (ctx) => {
  await ctx.reply(`<b>Tilni tanlang / Пожалуйста, выберите язык:</b>`, {
    parse_mode: "HTML",
    reply_markup: new Keyboard()
      .text("🇺🇿 O'zbek tili")
      .text("🇷🇺 Русский")
      .row()
      .oneTime()
      .resized(),
  });
};

// **Tilni saqlash va bo'limlarni ko'rsatish funksiyasi**
export const saveLang = async (ctx, lang) => {
  const user_id = ctx?.update?.message?.from?.id;

  const data = await User.findOne({ user_id });
  if (!data) {
    const newUser = new User({ user_id, user_lang: lang });
    await newUser.save();
  } else {
    await User.updateOne({ user_id }, { user_lang: lang });
  }
  await sendHomeMenu(ctx, lang);
};

// **Foydalanuvchilar bo'limi**
export const userSection = async (ctx, lang) => {
  const keyboard = new Keyboard()
    .text(lang === "UZB" ? "📞 Telefon raqamlar" : "📞 Телефонные номера")
    .row()
    .text(lang === "UZB" ? "🧑‍🤝‍🧑 Foydalanuvchi ro'yxati" : "🧑‍🤝‍🧑 Список пользователей")
    .row()
    .text(lang === "UZB" ? "⬅️ Orqaga" : "⬅️ Назад")
    .oneTime()
    .resized();

  await ctx.reply(
    lang === "UZB"
      ? "<b>Foydalanuvchilar bo'limi:</b>"
      : "<b>Раздел Пользователи:</b>",
    { parse_mode: "HTML", reply_markup: keyboard }
  );
};

// **Murojaatlar bo'limi**
export const requestsSection = async (ctx, lang) => {
  const keyboard = new Keyboard()
    .text(lang === "UZB" ? "📋 Murojaatlar haqida" : "📋 О запросах")
    .text(lang === "UZB" ? "📝 Shikoyat va takliflar" : "📝 Жалобы и предложения")
    .row()
    .text(lang === "UZB" ? "⬅️ Orqaga" : "⬅️ Назад")
    .oneTime()
    .resized();

  await ctx.reply(
    lang === "UZB" ? "<b>Murojaatlar bo'limi:</b>" : "<b>Раздел Запросы:</b>",
    { parse_mode: "HTML", reply_markup: keyboard }
  );
};

// **Adabiyotlar bo'limi**
export const literatureSection = async (ctx, lang) => {
  const keyboard = new Keyboard()
    .text(lang === "UZB" ? "📚 Qiziqarli ma'lumotlar" : "📚 Интересные данные")
    .text(lang === "UZB" ? "📝 Namunaliy blanklar" : "📝 Образцы бланков")
    .row()
    .text(lang === "UZB" ? "📄 Kerakli hujjatlar" : "📄 Необходимые документы")
    .text(lang === "UZB" ? "📹 Video qo'llanmalar" : "📹 Видео-руководства")
    .row()
    .text(lang === "UZB" ? "⬅️ Orqaga" : "⬅️ Назад")
    .oneTime()
    .resized();

  await ctx.reply(
    lang === "UZB" ? "<b>Adabiyotlar bo'limi:</b>" : "<b>Раздел Литература:</b>",
    { parse_mode: "HTML", reply_markup: keyboard }
  );
};

// **Xabarlar bo'limi**
export const messagesSection = async (ctx, lang) => {
  const keyboard = new Keyboard()
    .text(lang === "UZB" ? "📬 Yangi xabarlar" : "📬 Новые сообщения")
    .row()
    .text(lang === "UZB" ? "📨 Barcha xabarlar" : "📨 Все сообщения")
    .row()
    .text(lang === "UZB" ? "⬅️ Orqaga" : "⬅️ Назад")
    .oneTime()
    .resized();

  await ctx.reply(
    lang === "UZB" ? "<b>Xabarlar bo'limi:</b>" : "<b>Раздел Сообщения:</b>",
    { parse_mode: "HTML", reply_markup: keyboard }
  );
};

// Asosiy menyu
export const sendHomeMenu = async (ctx, lang) => {
  const keyboard = new Keyboard()
    .text(lang === "UZB" ? "🗃️ Adabiyotlar" : "🗃 Литература")
    .text(lang === "UZB" ? "📣 Xabarlar" : "📣 Сообщения")
    .row()
    .text(lang === "UZB" ? "🪧 Murojaatlar" : "🪧 Запросы")
    .text(lang === "UZB" ? "🧑🏾‍🤝‍🧑🏾 Foydalanuvchilar" : "🧑🏾‍🤝‍🧑🏾 Пользователи")
    .row()
    .text(lang === "UZB" ? "♻️ Tilni o'zgartirish" : "♻️ Изменить язык")
    .oneTime()
    .resized();

  await ctx.reply(
    lang === "UZB" ? "<b>Asosiy menyu:</b>" : "<b>Главное меню:</b>",
    { parse_mode: "HTML", reply_markup: keyboard }
  );
};
