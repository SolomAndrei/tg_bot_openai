import 'dotenv/config';
import { Bot, session } from 'grammy';
import { BotContext } from './types/bot-types';
import { startHandler } from './handlers/start';
import { AiAnswerHandler } from './handlers/ai-answer';
import { Hears } from './consts/hears';
import { SessionData } from './types/bot-types';
import { helpHandler } from './handlers/help';
import { getMainMenuKeyboard } from './handlers/start';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set in .env file');
}

export const bot = new Bot<BotContext>(BOT_TOKEN);

bot.use(
  session<SessionData, BotContext>({
    initial: () => ({
      waitingForAI: false,
    }),
  }),
);
bot.command('start', startHandler);

bot.hears([Hears.AI_HELPER_ON, Hears.AI_HELPER_OFF], async (ctx) => {
  ctx.session.waitingForAI = !ctx.session.waitingForAI;
  const isWaiting = ctx.session.waitingForAI;
  const message = isWaiting
    ? 'AI Helper mode is on! Ask me anything.'
    : 'AI Helper mode is off.';
  await ctx.reply(message, {
    reply_markup: getMainMenuKeyboard(isWaiting),
  });
});
bot.hears(Hears.TEST_GENERATOR, AiAnswerHandler);
bot.hears(Hears.HELP, helpHandler);

bot.on('message:text', AiAnswerHandler);
