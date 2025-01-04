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
import { 
    handleError, 
    validateContent, 
    validateFullName, 
    validatePhone,
    sanitizeInput,
    isSessionExpired 
} from "../validates/complainValidate.js";

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 daqiqa
export const complaintSteps = {};

// Eng tepaga qo'shing
const createKeyboard = (buttonText) => {
    return new Keyboard()
        .text(buttonText)
        .row()
        .oneTime()
        .resized();
};


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


export const startComplaintFlow = async (ctx) => {
    try {
        const userId = ctx.from.id;
        const user = await User.findOne({ user_id: userId });
        const lang = user?.user_lang || "UZB";

        complaintSteps[userId] = {
            step: "fullName",
            timestamp: Date.now(),
            lang: lang,
            data: {}
        };

        const fullNameKeyboard = createKeyboard(
            lang === "UZB" ? "👤 F.I.SH. kiriting" : "👤 Ввести Ф.И.О."
        );

        await ctx.reply(
            lang === "UZB"
                ? "Shikoyat va takliflar yuborish uchun quyidagi bosqichlardan o'ting:"
                : "Пройдите следующие шаги для отправки жалоб и предложений:",
            { reply_markup: fullNameKeyboard }
        );

        return true;
    } catch (error) {
        console.error('Shikoyat boshlash xatoligi:', error);
        await handleError(ctx, userId);
        return false;
    }
};

export const handleComplaintMessage = async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userMessage = ctx.message?.text;
        
        if (!complaintSteps[userId]) return false;

        const lang = complaintSteps[userId].lang;
        const step = complaintSteps[userId].step;
        const sanitizedMessage = sanitizeInput(userMessage);

        switch (step) {
            case "fullName":
                if (userMessage === (lang === "UZB" ? "👤 F.I.SH. kiriting" : "👤 Ввести Ф.И.О.")) {
                    complaintSteps[userId].step = "waitingFullName";
                    await ctx.reply(
                        lang === "UZB"
                            ? "👤 F.I.SH.ni to'liq kiriting:"
                            : "👤 Введите Ф.И.О. полностью:"
                    );
                    return true;
                }
                return false;

            case "waitingFullName":
                if (!validateFullName(sanitizedMessage)) {
                    await ctx.reply(
                        lang === "UZB"
                            ? "❌ Noto'g'ri F.I.SH. Iltimos, qaytadan kiriting."
                            : "❌ Неверный формат Ф.И.О. Пожалуйста, введите снова."
                    );
                    return true;
                }
                complaintSteps[userId].data.fullName = sanitizedMessage;
                complaintSteps[userId].step = "address";
                
                const addressKeyboard = createKeyboard(
                    lang === "UZB" ? "📍 Manzil kiriting" : "📍 Ввести адрес"
                );
                
                await ctx.reply(
                    lang === "UZB"
                        ? "📍 Manzilingizni kiriting:"
                        : "📍 Введите ваш адрес:",
                    { reply_markup: addressKeyboard }
                );
                return true;

            case "address":
                if (userMessage === (lang === "UZB" ? "📍 Manzil kiriting" : "📍 Ввести адрес")) {
                    complaintSteps[userId].step = "waitingAddress";
                    await ctx.reply(
                        lang === "UZB"
                            ? "📍 Manzilingizni to'liq kiriting:"
                            : "📍 Введите ваш полный адрес:"
                    );
                    return true;
                }
                return false;

            case "waitingAddress":
                if (sanitizedMessage.length < 5) {
                    await ctx.reply(
                        lang === "UZB"
                            ? "❌ Manzil juda qisqa. Iltimos, to'liqroq kiriting."
                            : "❌ Адрес слишком короткий. Пожалуйста, введите полнее."
                    );
                    return true;
                }
                complaintSteps[userId].data.address = sanitizedMessage;
                complaintSteps[userId].step = "phone";
                
                const phoneKeyboard = createKeyboard(
                    lang === "UZB" ? "📞 Telefon raqam kiriting" : "📞 Ввести номер телефона"
                );
                
                await ctx.reply(
                    lang === "UZB"
                        ? "📞 Telefon raqamingizni kiriting:\nMasalan: +998901234567"
                        : "📞 Введите номер телефона:\nНапример: +998901234567",
                    { reply_markup: phoneKeyboard }
                );
                return true;

            case "phone":
                if (!validatePhone(sanitizedMessage)) {
                    await ctx.reply(
                        lang === "UZB"
                            ? "❌ Noto'g'ri telefon raqam. Masalan: +998901234567"
                            : "❌ Неверный формат номера. Пример: +998901234567"
                    );
                    return true;
                }
                complaintSteps[userId].data.phone = sanitizedMessage;
                complaintSteps[userId].step = "content";
                await ctx.reply(
                    lang === "UZB"
                        ? "📝 Murojaatingiz matnini kiriting:"
                        : "📝 Введите текст обращения:"
                );
                return true;

            case "content":
                if (!validateContent(sanitizedMessage)) {
                    await ctx.reply(
                        lang === "UZB"
                            ? "❌ Murojaat matni noto'g'ri. 10-1000 belgi oralig'ida bo'lishi kerak."
                            : "❌ Текст обращения неверен. Должен быть от 10 до 1000 символов."
                    );
                    return true;
                }

                complaintSteps[userId].data.content = sanitizedMessage;
                await ctx.reply(
                    lang === "UZB"
                        ? "✅ Murojaatingiz muvaffaqiyatli qabul qilindi!"
                        : "✅ Ваше обращение успешно принято!"
                );
                delete complaintSteps[userId];
                return true;
        }
    } catch (error) {
        console.error('Shikoyatni qayta ishlashda xatolik:', error);
        await handleError(ctx, ctx.from.id);
        return false;
    }
};

export const handleUserList = async (ctx, lang) => {
    try {
        const users = await User.find({})
            .sort({ _id: -1 })  // eng oxirgi qo'shilganlar
            .limit(10)          // oxirgi 10 ta
            .select('username first_name last_name');  // faqat kerakli maydonlar

        if (!users || users.length === 0) {
            await ctx.reply(
                lang === "UZB"
                    ? "❌ Hozircha foydalanuvchilar yo'q"
                    : "❌ Пока нет пользователей"
            );
            return;
        }

        const userList = users.map((user, index) => {
            const username = user.username ? `@${user.username}` : 'username yo\'q';
            const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'ism ko\'rsatilmagan';
            return `${index + 1}. ${name} (${username})`;
        }).join('\n');

        await ctx.reply(
            lang === "UZB"
                ? `📊 Oxirgi 10 ta foydalanuvchi:\n\n${userList}`
                : `📊 Последние 10 пользователей:\n\n${userList}`
        );
    } catch (error) {
        console.error('Foydalanuvchilar ro\'yxatini olishda xatolik:', error);
        await ctx.reply(
            lang === "UZB"
                ? "❌ Xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
                : "❌ Произошла ошибка. Пожалуйста, попробуйте снова."
        );
    }
};
