import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

// API ma'lumotlari
const apiId = 20004120;
const apiHash = "609bd608ad35af2083a7ebe193ab818c";

// Sessiya stringini to'g'ri qo'ying
const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNDEBuwaUeSwgzI7cU4VccfbIEGVwUbpQDnvg5O7cqkGDwLuWtl2WD2g1oqlEUbrOeL6A7Gg9FZNzA56fVXW93T8bf9qU/kLWRFKuE7Jr4Ip9StE8X0wBx2k3Ph3aLHdvFx0FycvzysrhXLIU8UBKaIB7ZFQibyNdVjO0t2IFCAEbwf/0TSqqQgEb17tnrGQB1EnQNMOXb/aWMYgu5A9eVvbXOe28wvVKbjFaiTCjVLbHK3VCVwZeEe7k8p8B+njhr48u5oKwGMR7vbl4UcGbudhgTVzaJKejsPlglKrj6t82pAkBzSvR/u3fr6V54fzb+OkbbKuwYXNaJUBfHATD83D+EFE="); // Bu yerga get_session.mjs dan olingan yangi sessiya stringini qo'ying

export const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
});

// Kanaldan xabarlarni olish
client.getHistory = async (channelUsername, options = { limit: 1 }) => {
    try {
        if (!client.connected) {
            await client.connect();
        }
        const channel = await client.getEntity(channelUsername);
        return await client.getMessages(channel, options);
    } catch (error) {
        console.error("Error getting messages:", error);
        return [];
    }
};
