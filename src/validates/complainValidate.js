
import bot from "../config/bot.js";
import User from "../models/user.js";
import { Keyboard } from "grammy";

// Validation functions
export const validateFullName = (name) => {
    return name && name.length >= 3 && name.length <= 100 && !/^\d+$/.test(name);
};

export const validatePhone = (phone) => {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
};

export const validateContent = (content) => {
    return content && content.length >= 10 && content.length <= 1000;
};

// Security functions
export const sanitizeInput = (input) => {
    if (!input) return "";
    return input
        .replace(/<[^>]*>/g, '')
        .trim()
        .substring(0, 1000);
};

export const isSessionExpired = (userId, complaintSteps) => {
    const session = complaintSteps[userId];
    if (!session || !session.timestamp) return true;
    return Date.now() - session.timestamp > 15 * 60 * 1000;
};

// Error handling
export const handleError = async (ctx, userId) => {
    try {
        const user = await User.findOne({ user_id: userId });
        const lang = user?.user_lang || "UZB";
        
        await ctx.reply(
            lang === "UZB"
                ? "❌ Xatolik yuz berdi. Iltimos, /start buyrug'i orqali qaytadan boshlang."
                : "❌ Произошла ошибка. Пожалуйста, начните заново через команду /start."
        );
    } catch (error) {
        console.error('Error in handleError:', error);
        await ctx.reply("⚠️ System error occurred");
    }
};