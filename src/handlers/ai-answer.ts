import { askAI } from '../services/ai';
import { BotContext } from '../types/bot-types';
import {markdownToHtml} from '../lib/formatMarkdown';

export async function AiAnswerHandler(
  ctx: BotContext,
  next: () => Promise<void>,
) {
  const message = ctx.message?.text;
  if (!ctx.session.waitingForAI) {
    return next();
  }
  if (!message) {
    return next();
  }

  const thinkingMessage = await ctx.reply('Thinking, it is not so easy...');

  const safeDelete = () =>
    ctx.api.deleteMessage(ctx.chat!.id, thinkingMessage.message_id);
  try {
    const response = await askAI(message);
    await ctx.reply(markdownToHtml(response?.answer ?? 'No answer from AI'), {
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.error('Error asking AI:', error);
    await ctx.reply('Error asking AI, try again later');
  } finally {
    safeDelete();
  }
}
