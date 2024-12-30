import User from "../models/user.js";
import { Complaint } from "../models/complaint.js";
import bot from '../config/bot.js'
import axios from 'axios';
import fs from 'fs';
import { client } from '../config/telegram.client.mjs';
import { translations } from '../config/translations.js';
import { getTranslation, handleError, validateUserId, sleep, sanitizeInput } from '../utils/common.js';
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

export const complaintSteps = {};

// Qiziqarli ma'lumotlar uchun handler
export const handleInterestingMaterials = async (ctx, lang) => {
    try {
        console.log('Qiziqarli ma\'lumotlar bo\'limiga o\'tish');
        const userId = validateUserId(ctx);

        const materials = [
            {
                filename: "tatil_boyicha.pdf",
                url: `${process.env.IMAGEKIT_URL_ENDPOINT}/qiziqarli_malumot/tatil_boyicha.pdf`,
                description: "👨‍💻 Xodimga mehnat ta'tillarini shakllantirish, berish hamda ta'tillarni rasmiylashtirish bo'yicha tavsiyalar "
            }
        ];

        await ctx.reply(getTranslation(lang, 'INTERESTING_MATERIALS', 'START'));

        for (const material of materials) {
            try {
                await ctx.replyWithDocument(material.url, {
                    caption: `📚 ${material.description}\n\nFayl: ${material.filename}`,
                    filename: material.filename
                });
                await sleep(1000); // Prevent flooding
            } catch (error) {
                console.error(`Error sending material ${material.filename}:`, error);
                await handleError(ctx, error, lang);
            }
        }
    } catch (error) {
        await handleError(ctx, error, lang);
    }
};

// Video qo'llanmalar uchun handler
export const handleVideoTutorials = async (ctx, lang) => {
    try {
        console.log('Video qo\'llanmalar bo\'limiga o\'tish');
        const userId = validateUserId(ctx);

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

        await ctx.reply(getTranslation(lang, 'VIDEO_TUTORIALS', 'START'));

        for (const material of materials) {
            try {
                // Videoni fayl sifatida yuborish
                await ctx.replyWithDocument(material.url, {
                    caption: `📹 ${material.description}`,
                    filename: material.filename
                });
                
                // Har bir video orasida kutish
                await sleep(1000);
            } catch (error) {
                console.error(`Error sending video ${material.filename}:`, error);
                await handleError(ctx, error, lang);
            }
        }
    } catch (error) {
        await handleError(ctx, error, lang);
    }
};


// Namunaliy blanklar uchun handler
export const handleSamplefarms = async (ctx, lang) => {
    try {
        console.log('Namunaliy blanklar bo\'limiga o\'tish');
        const userId = validateUserId(ctx);

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

        await ctx.reply(getTranslation(lang, 'SAMPLE_FARMS', 'START'));

        for (const farm of farms) {
            try {
                await ctx.replyWithDocument(farm.url, {
                    caption: `📝 ${farm.description}\n\nFayl: ${farm.filename}`,
                    filename: farm.filename
                });
                await sleep(1000); // Prevent flooding
            } catch (error) {
                console.error(`Error sending farm ${farm.filename}:`, error);
                await handleError(ctx, error, lang);
            }
        }
    } catch (error) {
        await handleError(ctx, error, lang);
    }
};

// Kerakli hujjatlar uchun handler
export const handleRequiredDocuments = async (ctx, lang) => {
    try {
        console.log('Kerakli hujjatlar bo\'limiga o\'tish');
        const userId = validateUserId(ctx);

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

        await ctx.reply(getTranslation(lang, 'REQUIRED_DOCUMENTS', 'START'));

        for (const doc of documents) {
            try {
                await ctx.replyWithDocument(doc.url, {
                    caption: `📄 ${doc.description}\n\nFayl: ${doc.filename}`,
                    filename: doc.filename
                });
                await sleep(1000); // Prevent flooding
            } catch (error) {
                console.error(`Error sending document ${doc.filename}:`, error);
                await handleError(ctx, error, lang);
            }
        }
    } catch (error) {
        await handleError(ctx, error, lang);
    }
};




// Call markaz uchun handler
export const handleCallCenter = async (ctx, lang) => {
    try {
        const userId = validateUserId(ctx);
        const message = getTranslation(lang, 'CALL_CENTER', 'MESSAGE');

        await ctx.reply(message, {
            reply_markup: {
                keyboard: [
                    [getTranslation(lang, 'CALL_CENTER', 'BACK')]
                ],
                resize_keyboard: true
            }
        });
    } catch (error) {
        await handleError(ctx, error, lang);
    }
};

// Yangi xabarlarni olish uchun handler
export const handleNewMessages = async (ctx, lang) => {
    try {
        const userId = validateUserId(ctx);
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
            await ctx.reply(getTranslation(lang, 'NEW_MESSAGES', 'SUCCESS'));
        } else {
            await ctx.reply(getTranslation(lang, 'NEW_MESSAGES', 'NO_MESSAGES'));
        }
    } catch (error) {
        await handleError(ctx, error, lang);
    }
};

// Barcha xabarlarni ko'rish uchun handler
export const handleAllNews = async (ctx, lang) => {
    console.log("==");
    
    try {
        const userId = validateUserId(ctx);
        const newsUrl = getTranslation(lang, 'ALL_NEWS', 'URL');

        await ctx.reply(
            `<a href="${newsUrl}">${getTranslation(lang, 'ALL_NEWS', 'MESSAGE')}</a>`,
            {
                parse_mode: "HTML",
                disable_web_page_preview: false
            }
        );
    } catch (error) {
        await handleError(ctx, error, lang);
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
        await handleError(ctx, error, 'UZB');
    }
};

// Menyu bo'limlarini boshqarish uchun handler
export const handleMenu = async (ctx, lang) => {
    try {
        console.log('Menyu bo\'limi tanlandi');
        const message = ctx.message.text;
        
        if (message === getTranslation(lang, 'MENU', 'USERS')) {
            await userSection(ctx, lang);
        } else if (message === getTranslation(lang, 'MENU', 'REQUESTS')) {
            await requestsSection(ctx, lang);
        } else if (message === getTranslation(lang, 'MENU', 'LITERATURE')) {
            await literatureSection(ctx, lang);
        } else if (message === getTranslation(lang, 'MENU', 'MESSAGES')) {
            await messagesSection(ctx, lang);
        }
    } catch (error) {
        await handleError(ctx, error, lang);
    }
};

// Til tanlash uchun handler
export const handleLanguage = async (ctx) => {
    try {
        console.log('Til tanlash tugmasi bosildi');
        const message = ctx.message.text;
        
        if (message === getTranslation('UZB', 'LANGUAGE', 'UZB')) {
            await saveLang(ctx, "UZB");
        } else if (message === getTranslation('UZB', 'LANGUAGE', 'RUS')) {
            await saveLang(ctx, "RUS");
        }
    } catch (error) {
        await handleError(ctx, error, 'UZB');
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
        await handleError(ctx, error, lang);
    }
};

// Shikoyat boshlash
export const handleComplaint = async (ctx, lang) => {
    const userId = ctx.from.id;
    complaintSteps[userId] = { step: "fullName", lang };

    const keyboard = new Keyboard()
        .text(getTranslation(lang, 'COMMON', 'CANCEL'))
        .resized();

    await ctx.reply(getTranslation(lang, 'COMPLAINT', 'START'), {
        parse_mode: "HTML",
        reply_markup: keyboard
    });
    await ctx.reply(getTranslation(lang, 'COMPLAINT', 'FULLNAME'));
};

export const processComplaint = async (ctx, lang) => {
    const userId = ctx.from.id;
    const userMessage = ctx.message?.text;

    // Check if user is in complaint flow and has correct language
    if (!complaintSteps[userId] || complaintSteps[userId].lang !== lang) {
        return false;
    }

    // Handle cancellation
    if (userMessage === getTranslation(lang, 'COMMON', 'CANCEL')) {
        delete complaintSteps[userId];
        await ctx.reply(getTranslation(lang, 'COMPLAINT', 'CANCELLED'));
        return true;
    }

    const { step } = complaintSteps[userId];

    switch (step) {
        case "fullName":
            complaintSteps[userId].fullName = userMessage;
            complaintSteps[userId].step = "address";
            await ctx.reply(getTranslation(lang, 'COMPLAINT', 'ADDRESS'));
            break;

        case "address":
            complaintSteps[userId].address = userMessage;
            complaintSteps[userId].step = "phone";
            await ctx.reply(getTranslation(lang, 'COMPLAINT', 'PHONE'));
            break;

        case "phone":
            // Simple phone validation
            if (!userMessage.match(/^\+?[0-9\s-]{10,}$/)) {
                await ctx.reply(getTranslation(lang, 'COMPLAINT', 'INVALID_PHONE'));
                return true;
            }
            complaintSteps[userId].phone = userMessage;
            complaintSteps[userId].step = "purpose";

            const purposeKeyboard = new Keyboard()
                .text(getTranslation(lang, 'COMPLAINT', 'TYPES', 'APPLICATION'))
                .text(getTranslation(lang, 'COMPLAINT', 'TYPES', 'COMPLAINT'))
                .row()
                .text(getTranslation(lang, 'COMPLAINT', 'TYPES', 'SUGGESTION'))
                .row()
                .text(getTranslation(lang, 'COMMON', 'CANCEL'))
                .resized();

            await ctx.reply(getTranslation(lang, 'COMPLAINT', 'PURPOSE'), {
                reply_markup: purposeKeyboard
            });
            break;

        case "purpose":
            const validTypes = [
                getTranslation(lang, 'COMPLAINT', 'TYPES', 'APPLICATION'),
                getTranslation(lang, 'COMPLAINT', 'TYPES', 'COMPLAINT'),
                getTranslation(lang, 'COMPLAINT', 'TYPES', 'SUGGESTION')
            ];
            if (!validTypes.includes(userMessage)) {
                await ctx.reply(getTranslation(lang, 'COMPLAINT', 'INVALID_PURPOSE'));
                return true;
            }
            complaintSteps[userId].purpose = userMessage;
            complaintSteps[userId].step = "content";
            await ctx.reply(getTranslation(lang, 'COMPLAINT', 'CONTENT'));
            break;

        case "content":
            complaintSteps[userId].content = userMessage;
            complaintSteps[userId].step = "confirm";

            const confirmKeyboard = new Keyboard()
                .text(getTranslation(lang, 'COMMON', 'CONFIRM'))
                .text(getTranslation(lang, 'COMMON', 'CANCEL'))
                .resized();

            const confirmMessage = 
                `<b>Murojaat ma'lumotlari:</b>\n\n` +
                `👤 F.I.SH.: ${complaintSteps[userId].fullName}\n` +
                `📍 Manzil: ${complaintSteps[userId].address}\n` +
                `📞 Telefon: ${complaintSteps[userId].phone}\n` +
                `📝 Turi: ${complaintSteps[userId].purpose}\n` +
                `✍️ Matn: ${complaintSteps[userId].content}`;

            await ctx.reply(confirmMessage, {
                parse_mode: "HTML",
                reply_markup: confirmKeyboard
            });
            break;

        case "confirm":
            if (userMessage === getTranslation(lang, 'COMMON', 'CONFIRM')) {
                const complaint = new Complaint({
                    user_id: userId,
                    fullName: complaintSteps[userId].fullName,
                    address: complaintSteps[userId].address,
                    phone: complaintSteps[userId].phone,
                    purpose: complaintSteps[userId].purpose,
                    content: complaintSteps[userId].content
                });

                await complaint.save();

                // Send notification to admin
                const adminMessage = 
                    `<b>📨 Yangi murojaat:</b>\n\n` +
                    `👤 F.I.SH.: ${complaintSteps[userId].fullName}\n` +
                    `📍 Manzil: ${complaintSteps[userId].address}\n` +
                    `📞 Telefon: ${complaintSteps[userId].phone}\n` +
                    `📝 Turi: ${complaintSteps[userId].purpose}\n` +
                    `✍️ Matn: ${complaintSteps[userId].content}`;

                // TODO: Replace with actual admin ID from env
                const ADMIN_ID = process.env.ADMIN_ID;
                if (ADMIN_ID) {
                    try {
                        await ctx.api.sendMessage(ADMIN_ID, adminMessage, {
                            parse_mode: "HTML",
                            reply_markup: new Keyboard()
                                .text("✅ Tasdiqlash")
                                .text("❌ Rad etish")
                                .resized()
                        });
                    } catch (error) {
                        console.error("Error sending message to admin:", error);
                    }
                }

                const mainKeyboard = new Keyboard()
                    .text("📝 Shikoyat va takliflar")
                    .row()
                    .text("⬅️ Orqaga")
                    .resized();

                await ctx.reply(getTranslation(lang, 'COMPLAINT', 'SUCCESS'), {
                    reply_markup: mainKeyboard
                });
                delete complaintSteps[userId];
            } else if (userMessage === getTranslation(lang, 'COMMON', 'CANCEL')) {
                delete complaintSteps[userId];
                const mainKeyboard = new Keyboard()
                    .text("📝 Shikoyat va takliflar")
                    .row()
                    .text("⬅️ Orqaga")
                    .resized();
                await ctx.reply(getTranslation(lang, 'COMPLAINT', 'CANCELLED'), {
                    reply_markup: mainKeyboard
                });
            }
            break;
    }
    return true;
};

export const handleComplaintCallback = async (ctx) => {
    const callbackData = ctx.callbackQuery.data;
    const [action, complaintId] = callbackData.split('=');
    
    try {
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            await ctx.answerCallbackQuery("Murojaat topilmadi");
            return;
        }

        if (action === 'approve_complaint') {
            complaint.status = 'approved';
            await complaint.save();
            await ctx.api.sendMessage(complaint.user_id, "✅ Sizning murojaatingiz tasdiqlandi va tegishli bo'limga yuborildi");
            await ctx.answerCallbackQuery("✅ Murojaat tasdiqlandi");
        } else if (action === 'reject_complaint') {
            complaint.status = 'rejected';
            await complaint.save();
            await ctx.api.sendMessage(complaint.user_id, "❌ Sizning murojaatingiz rad etildi. Iltimos, ma'lumotlarni tekshirib qayta yuboring");
            await ctx.answerCallbackQuery("❌ Murojaat rad etildi");
        }
    } catch (error) {
        console.error("Error handling complaint callback:", error);
        await ctx.answerCallbackQuery("Xatolik yuz berdi");
    }
};