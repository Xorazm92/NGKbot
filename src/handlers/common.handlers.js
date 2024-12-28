import User from "../models/user.js";
import axios from 'axios';
import fs from 'fs';


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


// export const handleSamplefarms = async (ctx, lang) => {
//     try {
//         console.log("Namunaliy blanklar bo'limiga o'tish");
//         const farms = [
//             {
//                 filename: "blanklar.zip",
//                 url: `${process.env.IMAGEKIT_URL_ENDPOINT}/blanklar.zip`,
//                 description: "Buyruq blanka namunasi"
//             },
//         ];

//         await ctx.reply(
//             lang === "UZB"
//                 ? "📝 Namunaliy blanklarni yuborish boshlanmoqda..."
//                 : "📝 Начинается отправка образцов бланков..."
//         );

//         for (const farm of farms) {
//             try {
//                 const file = new InputFile(farm.url);
//                 await ctx.replyWithDocument(
//                     file,
//                     {
//                         caption: lang === "UZB"
//                             ? `📝 ${farm.description}\n\nFayl: ${farm.filename}`
//                             : `📝 ${farm.description}\n\nФайл: ${farm.filename}`,
//                         parse_mode: "HTML"
//                     }
//                 );
//             } catch (error) {
//                 console.error(`Error sending farm ${farm.filename}:`, error);
//                 await ctx.reply(
//                     lang === "UZB"
//                         ? `❌ Blankni yuborishda xatolik: ${farm.filename}`
//                         : `❌ Ошибка при отправке бланка: ${farm.filename}`
//                 );
//             }
//         }
//     } catch (error) {
//         console.error("Error in Sample farms handler:", error);
//         await ctx.reply(
//             lang === "UZB"
//                 ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
//                 : "❌ Произошла ошибка. Пожалуйста, попробуйте снова."
//         );
//     }
// };

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


// Shikoyat va takliflar uchun handler
export const handleComplaintsAndSuggestions = async (ctx, lang) => {
    try {
        const message = lang === "UZB"
            ? "📝 Shikoyat va takliflaringizni yozib qoldiring. Biz albatta ko'rib chiqamiz va javob beramiz."
            : "📝 Оставьте свои жалобы и предложения. Мы обязательно рассмотрим и ответим.";

        await ctx.reply(message, {
            reply_markup: {
                keyboard: [
                    [lang === "UZB" ? "⬅️ Orqaga" : "⬅️ Назад"]
                ],
                resize_keyboard: true
            }
        });
    } catch (error) {
        console.error('Error in Complaints and suggestions handler:', error);
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
