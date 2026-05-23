require('dotenv').config({ path: '.env.local' });
const Groq = require('groq-sdk');

(async () => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say "AI Coach is working!" in one sentence.' }],
      max_tokens: 50,
    });
    console.log('✅ SUCCESS:', completion.choices[0]?.message?.content);
  } catch (e) {
    console.error('❌ Failed:', e.message);
  }
})();
