import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

function geminiAiPlugin(): Plugin {
  return {
    name: 'loomy-gemini-ai-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/ai/')) {
          return next();
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not set on the server.' }));
          return;
        }

        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            const body = bodyStr ? JSON.parse(bodyStr) : {};

            if (req.url === '/api/ai/analyze') {
              const { transcript, durationSeconds, drillContext } = body;
              const prompt = `You are Loomy's expert voice and presentation executive coach.
Analyze the following user speech transcript:
"""
${transcript}
"""
Context: ${drillContext || 'Speech practice drill'}
Duration: ${durationSeconds || 10} seconds.

Evaluate the speaker's clarity, pacing, vocabulary, structure, filler word usage, and presence.
Provide an insightful, authentic evaluation.
You MUST reply with ONLY valid JSON with this exact schema:
{
  "clarityScore": <number 50-99>,
  "wpm": <number calculated words per minute>,
  "paceRating": <"Too Slow" | "Optimal" | "Fast" | "Rushed">,
  "fillerCount": <number of filler words>,
  "fillersDetected": [{"word": "<filler word>", "count": <number>}],
  "tone": "<brief description of vocal tone and presence, e.g. 'Calm and conversational', 'Energetic but rushed'>",
  "strengths": ["<detailed specific strength 1>", "<detailed specific strength 2>"],
  "tips": ["<concrete, actionable coaching tip 1>", "<concrete, actionable coaching tip 2>"],
  "summary": "<2-sentence personalized executive feedback on their performance>"
}`;

              const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json' },
                  }),
                }
              );

              if (!response.ok) {
                const errText = await response.text();
                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: errText }));
                return;
              }

              const data = await response.json();
              const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
              const parsed = JSON.parse(textContent);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(parsed));
              return;
            }

            if (req.url === '/api/ai/roleplay') {
              const { scenario, history, userMessage } = body;
              const prompt = `You are roleplaying as:
Name: ${scenario.partnerName}
Role: ${scenario.role}
Context: ${scenario.description}
Objective: Have a realistic, challenging, conversational dialogue with the user.

Conversation History:
${(history || [])
  .map((m: { sender: string; text: string }) => `${m.sender === 'user' ? 'User' : scenario.partnerName}: ${m.text}`)
  .join('\n')}
User just said: "${userMessage}"

Respond naturally in character (keep response to 2-3 sentences), AND provide real-time coaching feedback for the user's latest response.
Respond with ONLY valid JSON:
{
  "reply": "<Your in-character spoken reply>",
  "feedback": "<1 sentence tactical coaching tip on how well the user answered or how to steer the conversation>",
  "score": <number 50-98 rating user's message effectiveness>
}`;

              const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json' },
                  }),
                }
              );

              if (!response.ok) {
                const errText = await response.text();
                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: errText }));
                return;
              }

              const data = await response.json();
              const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
              const parsed = JSON.parse(textContent);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(parsed));
              return;
            }

            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (err: unknown) {
            console.error('AI Proxy Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    geminiAiPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: false,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
