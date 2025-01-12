import { Keyboard } from "grammy";
import mongoose from 'mongoose';
import ImageKit from 'imagekit';
import Literature from '../models/literature.model.js';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const LITERATURE_SECTIONS = {
    'interesting_info': '📚 Qiziqarli ma\'lumotlar',
    'sample_forms': '📝 Namunaliy blanklar',
    'required_docs': '📄 Kerakli hujjatlar',
    'video_tutorials': '📹 Video qo\'llanmalar'
};

export const adminCommands = {
    addLiterature: async (ctx) => {
        try {
            if (!ctx.session.isAdmin) {
                return ctx.reply("Bu funksiya faqat adminlar uchun!");
            }

            if (!ctx.session.adminAction) {
                ctx.session.adminAction = 'waitingForSection';
                const keyboard = new Keyboard();
                Object.values(LITERATURE_SECTIONS).forEach(section => {
                    keyboard.text(section).row();
                });
                keyboard.resized();
                
                return ctx.reply(
                    "Qaysi bo'limga ma'lumot qo'shmoqchisiz?",
                    { reply_markup: keyboard }
                );
            }

            if (ctx.session.adminAction === 'waitingForSection') {
                const section = Object.entries(LITERATURE_SECTIONS)
                    .find(([_, value]) => value === ctx.message.text)?.[0];
                
                if (!section) {
                    return ctx.reply("Noto'g'ri bo'lim tanlandi. Iltimos qaytadan urinib ko'ring.");
                }

                ctx.session.selectedSection = section;
                ctx.session.adminAction = 'waitingForFile';
                
                const isVideo = section === 'video_tutorials';
                return ctx.reply(
                    isVideo ?
                    "Video fayl va tavsif yuborishingiz mumkin.\n" +
                    "Format:\n" +
                    "Sarlavha\n" +
                    "Tavsif" :
                    "Fayl (PDF/DOC/DOCX) va tavsif yuborishingiz mumkin.\n" +
                    "Format:\n" +
                    "Sarlavha\n" +
                    "Tavsif"
                );
            }

            if (ctx.session.adminAction === 'waitingForFile') {
                const isVideo = ctx.session.selectedSection === 'video_tutorials';
                
                if (!ctx.message.document && !ctx.message.video) {
                    return ctx.reply(isVideo ? 
                        "Iltimos, video fayl yuboring" : 
                        "Iltimos, fayl yuboring (PDF/DOC/DOCX)");
                }

                const file = ctx.message.document || ctx.message.video;
                const caption = ctx.message.caption;

                if (!caption || !caption.includes('\n')) {
                    return ctx.reply("Iltimos, sarlavha va tavsifni to'g'ri formatda yuboring");
                }

                const [title, description] = caption.split('\n');

                // Get file from Telegram
                const fileLink = await ctx.api.getFile(file.file_id);
                const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileLink.file_path}`;

                // Upload to ImageKit
                const uploadResponse = await imagekit.upload({
                    file: fileUrl,
                    fileName: file.file_name || `video_${Date.now()}.mp4`,
                    folder: `/literature/${ctx.session.selectedSection}`
                });

                const literature = new Literature({
                    category: ctx.session.selectedSection,
                    title,
                    description,
                    fileUrl: uploadResponse.url,
                    addedBy: ctx.from.id,
                    isVideo: isVideo
                });

                await literature.save();
                
                ctx.session.adminAction = null;
                ctx.session.selectedSection = null;
                
                return ctx.reply("Ma'lumot muvaffaqiyatli qo'shildi! ✅");
            }
        } catch (error) {
            console.error('Admin handler error:', error);
            return ctx.reply("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
        }
    },

    listLiterature: async (ctx) => {
        try {
            if (!ctx.session.isAdmin) {
                return ctx.reply("Bu funksiya faqat adminlar uchun!");
            }

            const literature = await Literature.find().sort({ createdAt: -1 });
            
            if (literature.length === 0) {
                return ctx.reply("Hozircha adabiyotlar mavjud emas.");
            }

            let message = "📚 Mavjud adabiyotlar:\n\n";
            literature.forEach((item, index) => {
                message += `${index + 1}. ${item.title}\n`;
                message += `Kategoriya: ${item.category}\n`;
                message += `Tavsif: ${item.description}\n`;
                message += `Fayl: ${item.fileUrl}\n\n`;
            });

            return ctx.reply(message);
        } catch (error) {
            console.error('Admin handler error:', error);
            return ctx.reply("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
        }
    },

    deleteLiterature: async (ctx) => {
        try {
            if (!ctx.session.isAdmin) {
                return ctx.reply("Bu funksiya faqat adminlar uchun!");
            }

            if (!ctx.session.adminAction) {
                ctx.session.adminAction = 'deleteLiterature';
                const literature = await Literature.find().sort({ createdAt: -1 });
                
                if (literature.length === 0) {
                    return ctx.reply("O'chirish uchun adabiyotlar mavjud emas.");
                }

                let message = "O'chirish uchun adabiyot ID raqamini yuboring:\n\n";
                literature.forEach((item, index) => {
                    message += `${index + 1}. ${item.title}\n`;
                });

                return ctx.reply(message);
            }

            const literatureId = parseInt(ctx.message.text) - 1;
            const literature = await Literature.find().sort({ createdAt: -1 });

            if (literatureId < 0 || literatureId >= literature.length) {
                return ctx.reply("Noto'g'ri ID raqami. Iltimos qaytadan urinib ko'ring.");
            }

            await Literature.findByIdAndDelete(literature[literatureId]._id);
            ctx.session.adminAction = null;

            return ctx.reply("Adabiyot muvaffaqiyatli o'chirildi! ✅");
        } catch (error) {
            console.error('Admin handler error:', error);
            return ctx.reply("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
        }
    }
};
