/**
 * Example Firebase Cloud Function / Express handler for the "Today's thought" AI card.
 * Deploy this on a secure backend — never ship a Gemini API key inside the app bundle.
 *
 * Set the key via Firebase's secret manager (value entered at the interactive prompt,
 * never as a command-line argument):
 *   firebase functions:secrets:set GEMINI_API_KEY
 *
 * npm i firebase-functions firebase-admin node-fetch
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { onRequest } = require('firebase-functions/v2/https');
const fetch = require('node-fetch');

const MODEL = 'gemini-3.6-flash';

exports.generateDailyThought = onRequest({ secrets: ['GEMINI_API_KEY'], cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const { babyName, ageLabel, recentNotes } = req.body || {};
  if (!babyName || !ageLabel) {
    res.status(400).json({ error: 'babyName and ageLabel are required' });
    return;
  }

  const prompt = `You are a warm, knowledgeable parenting companion inside a baby memory-keeping app.
Baby: ${babyName}, currently ${ageLabel} old.

Recent notes the parents wrote about ${babyName}:
${recentNotes || '(no memories logged yet)'}

Write today's home-screen reflection for the parents. Ground it in ${babyName}'s age and, when relevant, the recent notes above. Keep it warm and specific — never generic filler.

Respond with ONLY a JSON object of the shape:
{"reflection": "...", "tip": "...", "developmentalNote": "..."}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      res.status(502).json({ error: `Gemini error: ${text}` });
      return;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message || 'AI proxy error' });
  }
});
