import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import {greetings_text} from './texts';
import {
    feedback_button,
    feedback_cmd,
    hire_button,
    hire_cmd,
    idea_button,
    idea_cmd,
    share_button,
    share_cmd
} from './commands';

const bot = new TelegramBot('5718409328:AAEmSgtY_e-dvXq_ymbHmLWAbtBChVHX8OU', { polling: true });
// const bot = new TelegramBot(envToString(process.env.BOT_TOKEN, 'Bot Token'), { polling: true });

const states: Map<number, string> = new Map<number, string>();

bot.setMyCommands([
    { command: '/start', description: 'Start screen' },
    { command: '/feedback', description: 'Share your feedback' },
    { command: '/share', description: 'Share you protest results' },
    { command: '/idea', description: 'Share you protest idea' },
    { command: '/hire', description: 'Work with us' },
]);

bot.on('message', ctx => {
    if (ctx.text === '/start') {
        bot.sendPhoto(ctx.chat.id,
            fs.readFileSync('./src/greetings.jpg'), {
                caption: greetings_text,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [feedback_button, share_button],
                        [idea_button, hire_button]
                    ]
                },
            }
        )
        return;
    }
    if (states.get(ctx.chat.id) === 'wait_feedback') {
        bot.sendMessage(-1001771790391, '#feedback\n' + ctx.text || '');
        bot.sendMessage(ctx.chat.id, 'Спасибо!');
        states.set(ctx.chat.id, '');
        return;
    }
    if (states.get(ctx.chat.id) === 'wait_share') {
        bot.sendMessage(-1001771790391, '#share\n' + ctx.text || '');
        bot.sendMessage(ctx.chat.id, 'Спасибо!');
        states.set(ctx.chat.id, '');
        return;
    }
    if (states.get(ctx.chat.id) === 'wait_idea') {
        bot.sendMessage(-1001771790391, '#idea\n' + ctx.text || '');
        bot.sendMessage(ctx.chat.id, 'Спасибо!');
        states.set(ctx.chat.id, '');
        return;
    }
    if (states.get(ctx.chat.id) === 'wait_hire') {
        bot.sendMessage(-1001771790391, '#hire\n' + ctx.text || '');
        bot.sendMessage(ctx.chat.id, 'Спасибо!');
        states.set(ctx.chat.id, '');
        return;
    }
});

bot.on('callback_query', ctx => {
    const command = ctx.data;
    if (!command) {
        console.error('callback_query failed. Command undefined');
    }
    if (!ctx.message || !ctx.message.chat.id) {
        return;
    }
    const chatId = ctx.message.chat.id;
    switch (command) {
        case feedback_cmd:
            bot.sendMessage(chatId,
                'Спасибо что решил_а поделиться своими мыслями. Напиши нам или приложи картинку');
            states.set(chatId, 'wait_feedback');
            break;
        case share_cmd:
            bot.sendMessage(chatId,
                'Круто что ты сделала это! Приложи фотографию акции и можешь написать пару пояснительных комментариев');
            states.set(chatId, 'wait_share');
            break;
        case idea_cmd:
            bot.sendMessage(chatId,
                'Спасибо! Мы с нетерпением ждем новых идей!');
            states.set(chatId, 'wait_idea');
            break;
        case hire_cmd:
            bot.sendMessage(chatId,
                'Отлично, напиши на немного о себе и как ты бы хотел_а помочь.');
            states.set(chatId, 'wait_hire');
            break;
        default:
            console.error('Unknown Telegram command');
    }
    // console.log(JSON.parse(ctx.data));
    // if (!ctx.data){
    //     console.error('No callback data');
    // }
})
