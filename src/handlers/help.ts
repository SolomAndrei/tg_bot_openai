import { BotContext } from '../types/bot-types';

export async function helpHandler(ctx: BotContext) {
  await ctx.reply(
    'Available actions:\n' +
      '/start - restart the bot\n' +
      'Just write any text to ask a question to AI.\n' +
      'Or use the menu buttons (Test Generator, AI Helper).',
  );
}
