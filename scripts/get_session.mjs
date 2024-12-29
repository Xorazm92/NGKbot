import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';  // To'g'ri yo'lni qo'llash
import { text } from 'input';

const apiId = 20004120;  // Sizning API ID
const apiHash = '609bd608ad35af2083a7ebe193ab818c';  // Sizning API hash
const stringSession = new StringSession('');  // Bo'sh sessiya stringi

(async () => {
    console.log("Sessiya olish uchun tizimga kiring:");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await text("Telefon raqam: "),
        password: async () => await text("Parol (agar mavjud bo'lsa): "),
        phoneCode: async () => await text("Tasdiq kodi: "),
        onError: (err) => console.log(err),
    });

    console.log("Muvaffaqiyatli ulandik!");
    console.log("Session string (buni telegram.client.mjs fayliga qo'ying):");
    console.log(client.session.save());  // Sessiya stringini chiqarish
    process.exit(0);
})();

