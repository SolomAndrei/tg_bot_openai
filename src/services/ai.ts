import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

const SYSTEM_PROMPT = `You are an expert in the field of AI and technology. 
You help users with their questions and problems on any language. 
You must give answers in the same language as the user's question. 
Main rules: - address the user as Milorad, if the user deviates from the IT topic, 
call him by name and say that you will not answer on other topics.
CRITICAL: You MUST ALWAYS respond with a valid JSON object containing exactly two keys: 
"question" (the user's question) and "answer" (your response or refusal).
`;

export async function askAI(
  userPrompt: string,
): Promise<{ question?: string; answer?: string } | null> {
  const response = await openai.chat.completions.create({
    model: 'gemini-2.5-flash',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  });
  const content = response.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const parsedObj = JSON.parse(content);
    return parsedObj;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return { answer: content };
  }
}
