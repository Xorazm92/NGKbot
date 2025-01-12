import { Bot, session } from 'grammy';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN || '');

// Add session middleware
bot.use(session({
    initial: () => ({
        isAdmin: false,
        adminAction: null,
        selectedSection: null
    })
}));

// Add error handling middleware
bot.use(async (ctx, next) => {
    try {
        // Check if user is admin
        if (ctx.from?.id) {
            const userId = ctx.from.id.toString();
            const adminId = process.env.ADMIN_ID;
            const adminGroupId = process.env.ADMIN_GROUP_ID;
            
            console.log('User ID:', userId);
            console.log('Admin ID:', adminId);
            console.log('Admin Group ID:', adminGroupId);
            
            ctx.session.isAdmin = userId === adminId;
            
            console.log('Is Admin:', ctx.session.isAdmin);
        }

        // Add command to context for easier access
        if (ctx.message?.text?.startsWith('/')) {
            ctx.command = ctx.message.text.split(' ')[0].substring(1);
            console.log('Command:', ctx.command);
        }

        await next();
    } catch (error) {
        console.error('Bot error:', error);
        await ctx.reply('Kechirasiz, nosozlik yuz berdi.');
    }
});

console.log("Bot ishga tushdi");

// Remove the bot.start() call since we'll start it in index.js
export { bot };

// Export bot instance as default
export default bot;
