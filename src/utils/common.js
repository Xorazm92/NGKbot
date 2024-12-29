import { translations } from '../config/translations.js';

export const getTranslation = (lang, category, key) => {
    return translations[lang]?.[category]?.[key] || translations['UZB'][category][key];
};

export const handleError = async (ctx, error, lang, customMessage = null) => {
    console.error('Error:', error.message, '\nStack:', error.stack);
    const errorMessage = customMessage || translations[lang].COMMON.ERROR;
    await ctx.reply(errorMessage);
};

export const validateUserId = (ctx) => {
    const userId = ctx?.from?.id;
    if (!userId) {
        throw new Error('Invalid user ID');
    }
    return userId;
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>]/g, ''); // Basic XSS prevention
};
