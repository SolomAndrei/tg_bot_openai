import { Keyboard, InlineKeyboard } from 'grammy';
import { BotContext } from '../types/bot-types';
import { Hears } from '../consts/hears';

export function getMainMenuKeyboard(isWaitingForAI: boolean) {
  const aiButtonText = isWaitingForAI
    ? Hears.AI_HELPER_ON
    : Hears.AI_HELPER_OFF;

  return new Keyboard()
    .text(aiButtonText)
    .text(Hears.TEST_GENERATOR)
    .text(Hears.HELP)
    .resized()
    .persistent();
}

export async function startHandler(ctx: BotContext) {
  const name = ctx.from?.first_name ?? 'Milorad';
  const isWaiting = ctx.session.waitingForAI;

  await ctx.reply(
    `
    Hello, ${name}! 
    How are you? i am your assistant!
    /start - start the bot
    /ai - ask the bot a question
    /test - generate a test
    `,
    {
      reply_markup: getMainMenuKeyboard(isWaiting),
    },
  );
}
