import User from "../models/user.js";
import bot from '../config/bot.js'
import axios from 'axios';
import fs from 'fs';
import { client } from '../config/telegram.client.mjs';
import { 
    sendHomeMenu, 
    saveLang,
    userSection,
    requestsSection,
    literatureSection,
    messagesSection,
    selectLang
} from './menu.handlers.js';
import { Keyboard } from "grammy";

const complaintSteps = {};

// Qiziqarli ma'lumotlar uchun handler
export const handleInterestingMaterials = async (ctx, lang) => {
    try {
        console.log('Qiziqarli ma\'lumotlar bo\'limiga o\'tish');

        const materials = [
            {
                filename: "tatil_boyicha.pdf",
                url: `${process.env.IMAGEKIT_URL_ENDPOINT}/qiziqarli_malumot/tatil_boyicha.pdf`,
                description: "👨‍💻 Xodimga mehnat ta'tillarini shakllantirish, berish hamda ta'tillarni rasmiylashtirish bo'yicha tavsiyalar "
            }
        ];

        await ctx.reply(
            lang === "UZB" 
                ? "📚 Qiziqarli ma'lumotlarni yuborish boshlanmoqda..."
                : "📚 Начинается отправка интересных материалов..."
        );

        for (const material of materials) {
            try {
                await ctx.replyWithDocument(material.url, {
                    caption: lang === "UZB"
                        ? `📚 ${material.description}\n\nFayl: ${material.filename}`
                        : `📚 ${material.description}\n\nФайл: ${material.filename}`,
                    filename: material.filename
                });
            } catch (error) {
                console.error(`Error sending material ${material.filename}:`, error);
                await ctx.reply(
                    lang === "UZB"
                        ? `❌ Faylni yuborishda xatolik yuz berdi: ${material.filename}`
                        : `❌ Ошибка при отправке файла: ${material.filename}`
                );
            }
        }
    } catch (error) {
        console.error('Error in Qiziqarli ma\'lumotlar handler:', error);
        await ctx.reply(
            lang === "UZB"
                ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
                : "❌ Произошла ошибка. Пожалуйста, попробуйте снова."
        );
    }
};

// Video qo'llanmalar uchun handler
export const handleVideoTutorials = async (ctx, lang) => {
    try {
        console.log('Video qo\'llanmalar bo\'limiga o\'tish');
        const materials = [
            {
                filename: "ijro.gov.uz.mp4",
                url: "https://ik.imagekit.io/rk2mqxak6/videolar/ijro.gov.uz.mp4",
                description: "«Ijro.gov.uz» tizimi haqida video qo'llanma"
            },
            {
                filename: "ijro_intizomi_qarori.mp4",
                url: "https://ik.imagekit.io/rk2mqxak6/videolar/ijro_intizomi_qarori.mp4",
                description: "Ijro intizomi bo'yicha Prezident qarori"
            }
        ];

        await ctx.reply(
            lang === "UZB" 
                ? "📹 Video qo'llanmalarni yuborish boshlanmoqda..."
                : "📹 Начинается отправка видео-руководств..."
        );

        for (const material of materials) {
            try {
                // Videoni fayl sifatida yuborish
                await ctx.replyWithDocument(material.url, {
                    caption: lang === "UZB"
                        ? `📹 ${material.description}`
                        : `📹 ${material.description}`,
                    filename: material.filename
                });
                
                // Har bir video orasida kutish
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Error sending video ${material.filename}:`, error);
                await ctx.reply(
                    lang === "UZB"
                        ? `❌ Videoni yuborishda xatolik: ${material.filename}`
                        : `❌ Ошибка при отправке видео: ${material.filename}`
                );
            }
        }
    } catch (error) {
        console.error('Error in Video tutorials handler:', error);
        await ctx.reply(
            lang === "UZB"
                ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
                : "❌ Произошла ошибка. Пожалуйста, попробуйте снова."
        );
    }
};


// Namunaliy blanklar uchun handler
export const handleSamplefarms = async (ctx, lang) => {
    try {
        console.log('Namunaliy blanklar bo\'limiga o\'tish');
        const farms = [
            {
                filename: "blanklar.zip",
                url: `${process.env.IMAGEKIT_URL_ENDPOINT}/blanklar.zip`,
                description: "Na'munaviy blanklar va ishlab chiqish namunasi"
                
            },
            // {
            //     filename: "blanklar.zip",
            //     url: "https://ik.imagekit.io/rk2mqxak6/blanklar.zip",
            //     description: "Xat blanka namunasi"
            // },
            // {
            //     filename: "Farmoish.doc",
            //     url: "https://ik.imagekit.io/rk2mqxak6/blanklar/Farmoish.doc",
            //     description: "Farmoish blanka namunasi"
            // },
           
        ];

        await ctx.reply(
            lang === "UZB" 
                ? "📝 Namunaliy blanklarni yuborish boshlanmoqda..."
                : "📝 Начинается отправка образцов бланков..."
        );

        for (const farm of farms) {
            try {
                await ctx.replyWithDocument(farm.url, {
                    caption: lang === "UZB"
                        ? `📝 ${farm.description}\n\nFayl: ${farm.filename}`
                        : `📝 ${farm.description}\n\nФайл: ${farm.filename}`,
                    filename: farm.filename
                });
            } catch (error) {
                console.error(`Error sending farm ${farm.filename}:`, error);
                await ctx.reply(
                    lang === "UZB"
                        ? `❌ Blankni yuborishda xatolik: ${farm.filename}`
                        : `❌ Ошибка при отправке бланка: ${farm.filename}`
                );
            }
        }
    } catch (error) {
        console.error('Error in Sample farms handler:', error);
        await ctx.reply(
            lang === "UZB"
                ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
                : "❌ Произошла ошибка. Пожалуйста, попробуйте снова."
        );
    }
};

// Kerakli hujjatlar uchun handler
export const handleRequiredDocuments = async (ctx, lang) => {
    try {
        console.log('Kerakli hujjatlar bo\'limiga o\'tish');
        const documents = [
            {
                filename: "Mehnat_kodeksi.pdf",
                url: `${process.env.IMAGEKIT_URL_ENDPOINT}/kerakli_hujjatlar/Mehnat_kodeksi.pdf`,
                description: "Mehnat kodeksi(yangi taxriri)"
            },
            {
                filename: "Ish_yuritish.pdf",
                url: `${process.env.IMAGEKIT_URL_ENDPOINT}/kerakli_hujjatlar/Ish_yuritish.pdf`,
                description: "Davlat tilida ish yuritish(Amaliy qo'llanma)"
            }
        ];

        await ctx.reply(
            lang === "UZB" 
                ? "📄 Kerakli hujjatlarni yuborish boshlanmoqda..."
                : "📄 Начинается отправка необходимых документов..."
        );

        for (const doc of documents) {
            try {
                await ctx.replyWithDocument(doc.url, {
                    caption: lang === "UZB"
                        ? `📄 ${doc.description}\n\nFayl: ${doc.filename}`
                        : `📄 ${doc.description}\n\nФайл: ${doc.filename}`,
                    filename: doc.filename
                });
            } catch (error) {
                console.error(`Error sending document ${doc.filename}:`, error);
                await ctx.reply(
                    lang === "UZB"
                        ? `❌ Hujjatni yuborishda xatolik: ${doc.filename}`
                        : `❌ Ошибка при отправке документа: ${doc.filename}`
                );
            }
        }
    } catch (error) {
        console.error('Error in Required documents handler:', error);
        await ctx.reply(
            lang === "UZB"
                ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
                : "❌ Произошла ошибка. Пожалуйста, попробуйте снова."
        );
    }
};




// Call markaz uchun handler
export const handleCallCenter = async (ctx, lang) => {
    try {
        const message = lang === "UZB"
            ? "📞 Call markaz raqami: +998 71 237 91 21\n\nIsh vaqti: 09:00 - 18:00"
            : "📞 Номер Call центра: +998 71 237 91 21\n\nРабочее время: 09:00 - 18:00";

        await ctx.reply(message, {
            reply_markup: {
                keyboard: [
                    [lang === "UZB" ? "⬅️ Orqaga" : "⬅️ Назад"]
                ],
                resize_keyboard: true
            }
        });
    } catch (error) {
        console.error('Error in Call center handler:', error);
        await ctx.reply(
            lang === "UZB"
                ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
                : "❌ Произошла ошибка. Пожалуйста, попробуйте снова."
        );
    }
};

// Yangi xabarlarni olish uchun handler
export const handleNewMessages = async (ctx, lang) => {
    try {
        // Kanaldan xabar olish
        const messages = await client.getHistory("@uzrailways_uz", { limit: 1 });

        if (messages && messages.length > 0) {
            const lastMessage = messages[0];

            // Xabar matnini olish
            const messageText = lastMessage.text || lastMessage.message || "";
            const messageDate = new Date(lastMessage.date * 1000).toLocaleString();

            // Xabarni formatlash
            const formattedMessage = `📢 Yangi xabar:\n\n${messageText}\n\n📅 Sana: ${messageDate}`;

            // Xabarni yuborish
            await ctx.reply(formattedMessage, {
                parse_mode: "HTML",
                disable_web_page_preview: false
            });

            // Agar media bo'lsa, uni ham yuborish
            if (lastMessage.media) {
                try {
                    const buffer = await client.downloadMedia(lastMessage.media);
                    if (buffer) {
                        // Media turini aniqlash
                        let method = ctx.replyWithDocument;
                        let filename = 'media';
                        
                        if (lastMessage.media.photo) {
                            method = ctx.replyWithPhoto;
                            filename += '.jpg';
                        } else if (lastMessage.media.document) {
                            method = ctx.replyWithDocument;
                            filename = lastMessage.media.document.attributes?.[0]?.fileName || 'document';
                        } else if (lastMessage.media.video) {
                            method = ctx.replyWithVideo;
                            filename += '.mp4';
                        }

                        // Media faylni yuborish
                        await method({
                            source: buffer,
                            filename: filename
                        });
                    }
                } catch (mediaError) {
                    console.error("Error sending media:", mediaError);
                }
            }

            // Tasdiqlash xabari
            await ctx.reply(
                lang === "UZB"
                    ? "✅ Oxirgi xabar yuborildi"
                    : "✅ Последнее сообщение отправлено"
            );
        } else {
            await ctx.reply(
                lang === "UZB"
                    ? "❌ Kanalda xabarlar mavjud emas"
                    : "❌ В канале нет сообщений"
            );
        }
    } catch (error) {
        console.error("Error in handleNewMessages:", error);
        await ctx.reply(
            lang === "UZB"
                ? "❌ Xatolik yuz berdi"
                : "❌ Произошла ошибка"
        );
    }
};

// Barcha xabarlarni ko'rish uchun handler
export const handleAllNews = async (ctx, lang) => {
    console.log("==");
    
    try {
        const newsUrl = lang === "UZB" 
            ? "https://railway.uz/uz/informatsionnaya_sluzhba/novosti/"
            : "https://railway.uz/ru/informatsionnaya_sluzhba/novosti/";

        await ctx.reply(
            lang === "UZB"
                ? `<a href="${newsUrl}">O'zbekiston Temir Yo'llari rasmiy yangiliklar sahifasi</a>`
                : `<a href="${newsUrl}">Официальная страница новостей Узбекистон Темир Йуллари</a>`,
            {
                parse_mode: "HTML",
                disable_web_page_preview: false
            }
        );
    } catch (error) {
        console.error("Error in handleAllNews:", error);
        await ctx.reply(
            lang === "UZB"
                ? "❌ Xatolik yuz berdi"
                : "❌ Произошла ошибка"
        );
    }
};

// Start komandasi uchun handler
export const handleStart = async (ctx) => {
    try {
        console.log('Start komandasi ishga tushdi');
        const user_id = ctx?.update?.message?.from?.id;
        const user = await User.findOne({ user_id });
        
        if (user) {
            await sendHomeMenu(ctx, user.user_lang);
        } else {
            await selectLang(ctx);
        }
    } catch (error) {
        console.error('Start komandasida xatolik:', error);
        await ctx.reply("❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.\n❌ Произошла ошибка. Пожалуйста, попробуйте еще раз.");
    }
};

// Menyu bo'limlarini boshqarish uchun handler
export const handleMenu = async (ctx, lang) => {
    try {
        console.log('Menyu bo\'limi tanlandi');
        const message = ctx.message.text;
        
        if (message === "👥 Foydalanuvchilar" || message === "👥 Пользователи") {
            await userSection(ctx, lang);
        } else if (message === "📝 Murojaatlar" || message === "📝 Обращения") {
            await requestsSection(ctx, lang);
        } else if (message === "📚 Adabiyotlar" || message === "📚 Литература") {
            await literatureSection(ctx, lang);
        } else if (message === "📨 Xabarlar" || message === "📨 Сообщения") {
            await messagesSection(ctx, lang);
        }
    } catch (error) {
        console.error('Menyu bo\'limini tanlashda xatolik:', error);
        await ctx.reply(
            lang === "UZB" 
                ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
                : "❌ Произошла ошибка. Пожалуйста, попробуйте еще раз."
        );
    }
};

// Til tanlash uchun handler
export const handleLanguage = async (ctx) => {
    try {
        console.log('Til tanlash tugmasi bosildi');
        const message = ctx.message.text;
        
        if (message === "🇺🇿 O'zbek tili") {
            await saveLang(ctx, "UZB");
        } else if (message === "🇷🇺 Русский") {
            await saveLang(ctx, "RUS");
        }
    } catch (error) {
        console.error('Til tanlashda xatolik:', error);
        await ctx.reply("❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.\n❌ Произошла ошибка. Пожалуйста, попробуйте еще раз.");
    }
};

// Orqaga qaytish uchun handler
export const handleBack = async (ctx, lang) => {
    try {
        console.log('Orqaga qaytish tugmasi bosildi');
        const user_id = ctx?.update?.message?.from?.id;
        const user = await User.findOne({ user_id });
        
        if (user) {
            await sendHomeMenu(ctx, user.user_lang);
        } else {
            await sendHomeMenu(ctx, lang);
        }
    } catch (error) {
        console.error('Orqaga qaytishda xatolik:', error);

            lang === "UZB" 
                ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
                : "❌ Произошла ошибка. Пожалуйста, попробуйте еще раз."
        
    }
};

// // Shikoyat va takliflar bo'limi uchun funksiya
// export const handleComplaint = async (ctx, lang) => {
//     try {
//         const user_id = ctx?.from?.id;
//         const user = await User.findOne({ user_id });

//         if (!user) {
//             await ctx.reply(
//                 lang === "UZB" 
//                     ? "Botga \"/start\" tugmasi orqali qayta kiring"
//                     : "Перезайдите в бот через кнопку \"/start\""
//             );
//             return;
//         }

//         // Foydalanuvchi holatini yangilash
//         user.state = 'waiting_complaint';
//         await user.save();

//         await ctx.reply(
//             lang === "UZB" 
//                 ? "📝 Iltimos, quyidagi ma'lumotlarni kiriting:\n\n" +
//                   "1. F.I.SH. (to'liq)\n" +
//                   "2. Manzilingiz\n" +
//                   "3. Telefon raqamingiz\n" +
//                   "4. Murojaatingiz mazmuni\n\n" +
//                   "Har bir punktni yangi qatordan yozing."
//                 : "📝 Пожалуйста, введите следующую информацию:\n\n" +
//                   "1. Ф.И.О. (полностью)\n" +
//                   "2. Ваш адрес\n" +
//                   "3. Номер телефона\n" +
//                   "4. Содержание обращения\n\n" +
//                   "Каждый пункт пишите с новой строки."
//         );

//     } catch (error) {
//         console.error('Shikoyat formasi xatoligi:', error);
//         await ctx.reply(
//             lang === "UZB" 
//                 ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
//                 : "❌ Произошла ошибка. Пожалуйста, попробуйте еще раз."
//         );
//     }
// };
// // Shikoyat ma'lumotlarini qayta ishlash
// export const processComplaint = async (ctx, lang) => {
//     try {
//         const user_id = ctx?.from?.id;
//         const message = ctx.message.text;
        
//         // Xabarni qatorlarga ajratish
//         const lines = message.split('\n').filter(line => line.trim());
        
//         if (lines.length < 4) {
//             await ctx.reply(
//                 lang === "UZB"
//                     ? "❌ Iltimos, barcha ma'lumotlarni to'liq kiriting."
//                     : "❌ Пожалуйста, введите всю информацию полностью."
//             );
//             return;
//         }

//         // Ma'lumotlarni formatlash
//         const complaintData = {
//             fullName: lines[0],
//             address: lines[1],
//             contact: lines[2],
//             content: lines.slice(3).join('\n')
//         };

//         // Adminga xabar yuborish
//         const adminMessage = 
//             lang === "UZB"
//                 ? `📨 Yangi murojaat:\n\n` +
//                   `👤 F.I.SH.: ${complaintData.fullName}\n` +
//                   `📍 Manzil: ${complaintData.address}\n` +
//                   `📞 Aloqa: ${complaintData.contact}\n` +
//                   `📝 Murojaat mazmuni:\n${complaintData.content}`
//                 : `📨 Новое обращение:\n\n` +
//                   `👤 Ф.И.О.: ${complaintData.fullName}\n` +
//                   `📍 Адрес: ${complaintData.address}\n` +
//                   `📞 Контакт: ${complaintData.contact}\n` +
//                   `📝 Содержание обращения:\n${complaintData.content}`;

//         await ctx.api.sendMessage(process.env.ADMIN_ID, adminMessage);

//         // Foydalanuvchiga tasdiqlash xabari
//         await ctx.reply(
//             lang === "UZB"
//                 ? "✅ Murojaatingiz qabul qilindi va adminlarga yuborildi.\nTez orada ko'rib chiqiladi."
//                 : "✅ Ваше обращение принято и отправлено администраторам.\nОно будет рассмотрено в ближайшее время."
//         );

//         // Foydalanuvchi holatini tozalash
//         const user = await User.findOne({ user_id });
//         user.state = null;
//         await user.save();

//     } catch (error) {
//         console.error('Shikoyatni qayta ishlashda xatolik:', error);
//         await ctx.reply(
//             lang === "UZB"
//                 ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
//                 : "❌ Произошла ошибка. Пожалуйста, попробуйте еще раз."
//         );
//     }
// };


export const startComplaintFlow = async (ctx, lang) => {
    const userId = ctx.from.id;
    const user = await User.findOne({ user_id: userId });

    if (!user) {
        await ctx.reply(
            lang === "UZB" 
                ? "Botga \"/start\" tugmasi orqali qayta kiring"
                : "Перезайдите в бот через кнопку \"/start\"",
            { parse_mode: "HTML" }
        );
        return;
    }

    complaintSteps[userId] = { step: "fullName", lang };

    const keyboard = new Keyboard()
        .text(lang === "UZB" ? "👤 F.I.SH. kiriting" : "👤 Ввести Ф.И.О.")
        .row()
        .oneTime()
        .resized();

    await ctx.reply(
        lang === "UZB"
            ? "<b>Shikoyat va takliflar uchun ariza berish</b>\n\nQuyidagi ma'lumotlarni ketma-ketlikda kiriting:"
            : "<b>Подача заявки для жалоб и предложений</b>\n\nВведите следующую информацию в указанном порядке:",
        { 
            parse_mode: "HTML",
            reply_markup: keyboard 
        }
    );
};

export const handleComplaintMessage = async (ctx) => {
    const userId = ctx.from.id;
    const userMessage = ctx.message?.text;

    if (!complaintSteps[userId]) {
        return false;
    }

    const { step, lang } = complaintSteps[userId];

    const createKeyboard = (buttonText) => {
        return new Keyboard()
            .text(buttonText)
            .row()
            .oneTime()
            .resized();
    };

    switch (step) {
        case "fullName":
            if (userMessage === (lang === "UZB" ? "👤 F.I.SH. kiriting" : "👤 Ввести Ф.И.О.")) {
                await ctx.reply(
                    lang === "UZB"
                        ? "<b>👤 F.I.SH.ni to'liq kiriting:</b>"
                        : "<b>👤 Введите Ф.И.О. полностью:</b>",
                    { parse_mode: "HTML" }
                );
                complaintSteps[userId].step = "waitingFullName";
            }
            break;

        case "waitingFullName":
            complaintSteps[userId].fullName = userMessage;
            complaintSteps[userId].step = "address";
            await ctx.reply(
                lang === "UZB"
                    ? "<b>📍 Manzilingizni kiriting:</b>"
                    : "<b>📍 Введите ваш адрес:</b>",
                { 
                    parse_mode: "HTML",
                    reply_markup: createKeyboard(
                        lang === "UZB" ? "📍 Manzil kiriting" : "📍 Ввести адрес"
                    )
                }
            );
            break;

        case "address":
            if (userMessage === (lang === "UZB" ? "📍 Manzil kiriting" : "📍 Ввести адрес")) {
                await ctx.reply(
                    lang === "UZB"
                        ? "<b>📍 Manzilingizni yozing:</b>"
                        : "<b>📍 Напишите ваш адрес:</b>",
                    { parse_mode: "HTML" }
                );
                complaintSteps[userId].step = "waitingAddress";
            }
            break;

        case "waitingAddress":
            complaintSteps[userId].address = userMessage;
            complaintSteps[userId].step = "phone";
            await ctx.reply(
                lang === "UZB"
                    ? "<b>📞 Telefon raqamingizni kiriting:</b>"
                    : "<b>📞 Введите ваш номер телефона:</b>",
                { 
                    parse_mode: "HTML",
                    reply_markup: createKeyboard(
                        lang === "UZB" ? "📞 Telefon raqam kiriting" : "📞 Ввести номер телефона"
                    )
                }
            );
            break;

        case "phone":
            if (userMessage === (lang === "UZB" ? "📞 Telefon raqam kiriting" : "📞 Ввести номер телефона")) {
                await ctx.reply(
                    lang === "UZB"
                        ? "<b>📞 Telefon raqamingizni yozing:</b>"
                        : "<b>📞 Напишите ваш номер телефона:</b>",
                    { parse_mode: "HTML" }
                );
                complaintSteps[userId].step = "waitingPhone";
            }
            break;

        case "waitingPhone":
            complaintSteps[userId].phone = userMessage;
            complaintSteps[userId].step = "content";
            await ctx.reply(
                lang === "UZB"
                    ? "<b>📝 Murojaatingiz mazmunini kiriting:</b>"
                    : "<b>📝 Введите содержание обращения:</b>",
                { 
                    parse_mode: "HTML",
                    reply_markup: createKeyboard(
                        lang === "UZB" ? "📝 Murojaat matnini kiriting" : "📝 Ввести текст обращения"
                    )
                }
            );
            break;

        case "content":
            if (userMessage === (lang === "UZB" ? "📝 Murojaat matnini kiriting" : "📝 Ввести текст обращения")) {
                await ctx.reply(
                    lang === "UZB"
                        ? "<b>📝 Murojaatingiz matnini yozing:</b>"
                        : "<b>📝 Напишите текст вашего обращения:</b>",
                    { parse_mode: "HTML" }
                );
                complaintSteps[userId].step = "waitingContent";
            }
            break;

        case "waitingContent":
            complaintSteps[userId].content = userMessage;
            complaintSteps[userId].step = "confirm";

            const confirmKeyboard = new Keyboard()
                .text(lang === "UZB" ? "✅ Ha" : "✅ Да")
                .text(lang === "UZB" ? "❌ Yo'q" : "❌ Нет")
                .row()
                .oneTime()
                .resized();

            await ctx.reply(
                lang === "UZB"
                    ? `<b>Shikoyat ma'lumotlari:</b>\n\n` +
                      `👤 F.I.SH.: ${complaintSteps[userId].fullName}\n` +
                      `📍 Manzil: ${complaintSteps[userId].address}\n` +
                      `📞 Aloqa: ${complaintSteps[userId].phone}\n` +
                      `📝 Murojaat mazmuni:\n${complaintSteps[userId].content}\n\n` +
                      `<b>Ma'lumotlar to'g'rimi?</b>`
                    : `<b>Данные жалобы:</b>\n\n` +
                      `👤 Ф.И.О.: ${complaintSteps[userId].fullName}\n` +
                      `📍 Адрес: ${complaintSteps[userId].address}\n` +
                      `📞 Контакт: ${complaintSteps[userId].phone}\n` +
                      `📝 Содержание обращения:\n${complaintSteps[userId].content}\n\n` +
                      `<b>Данные верны?</b>`,
                { 
                    parse_mode: "HTML",
                    reply_markup: confirmKeyboard 
                }
            );
            break;

        case "confirm":
            if (userMessage === (lang === "UZB" ? "✅ Ha" : "✅ Да")) {
                const adminMessage = 
                    lang === "UZB"
                        ? `<b>📨 Yangi murojaat:</b>\n\n` +
                          `👤 F.I.SH.: ${complaintSteps[userId].fullName}\n` +
                          `📍 Manzil: ${complaintSteps[userId].address}\n` +
                          `📞 Aloqa: ${complaintSteps[userId].phone}\n` +
                          `📝 Murojaat mazmuni:\n${complaintSteps[userId].content}`
                        : `<b>📨 Новое обращение:</b>\n\n` +
                          `👤 Ф.И.О.: ${complaintSteps[userId].fullName}\n` +
                          `📍 Адрес: ${complaintSteps[userId].address}\n` +
                          `📞 Контакт: ${complaintSteps[userId].phone}\n` +
                          `📝 Содержание обращения:\n${complaintSteps[userId].content}`;

                await ctx.api.sendMessage(process.env.ADMIN_ID, adminMessage, { parse_mode: "HTML" });
                await requestsSection(ctx, lang);

                const user = await User.findOne({ user_id: userId });
                user.state = null;
                await user.save();
            } else {
                await requestsSection(ctx, lang);
            }
            delete complaintSteps[userId];
            break;
    }

    return true;
};