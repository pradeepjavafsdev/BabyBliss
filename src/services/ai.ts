import { getGenerativeModel, Schema } from 'firebase/ai';
import { Baby, DailyInsight, Memory } from '../types';
import { formatBabyAge } from '../utils/date';
import { buildDailyInsight } from '../data/demo';
import { getFirebaseAI } from './firebase';

/**
 * AI services stub — wire to OpenAI / Google Vision via Cloud Functions.
 */

const dailyThoughtSchema = Schema.object({
  properties: {
    reflection: Schema.string({
      description:
        "One warm, specific sentence for the parent's home screen about what the baby is likely doing or discovering right now, grounded in their age and, when useful, the recent notes provided.",
    }),
    tip: Schema.string({
      description: 'One short, practical, encouraging tip for the parent tied to this stage.',
    }),
    developmentalNote: Schema.string({
      description: 'One short factual developmental note typical for a baby at this age.',
    }),
  },
});

function recentNotesFor(memories: Memory[]) {
  return memories
    .slice(0, 5)
    .map((m) => `- "${m.title}"${m.note ? `: ${m.note}` : ''}`)
    .join('\n');
}

function toDailyInsight(
  ageLabel: string,
  memories: Memory[],
  parsed: Partial<Pick<DailyInsight, 'reflection' | 'tip' | 'developmentalNote'>>
): DailyInsight {
  return {
    id: `insight_${new Date().toISOString().slice(0, 10)}`,
    date: new Date().toISOString(),
    babyAgeLabel: ageLabel,
    reflection: parsed.reflection ?? '',
    tip: parsed.tip ?? '',
    developmentalNote: parsed.developmentalNote ?? '',
    memoryHighlightIds: memories.slice(0, 2).map((m) => m.id),
  };
}

const AI_PROXY_URL = process.env.EXPO_PUBLIC_AI_PROXY_URL ?? '';

async function generateDailyThoughtWithProxy(baby: Baby, memories: Memory[]): Promise<DailyInsight | null> {
  if (!AI_PROXY_URL || AI_PROXY_URL.includes('your-cloud-function.example.com')) return null;

  const ageLabel = formatBabyAge(baby.birthDate);
  const response = await fetch(AI_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ babyName: baby.name, ageLabel, recentNotes: recentNotesFor(memories) }),
  });
  if (!response.ok) {
    throw new Error(`AI proxy responded with ${response.status}`);
  }
  const parsed = await response.json();
  return toDailyInsight(ageLabel, memories, parsed);
}

async function generateDailyThoughtWithAI(baby: Baby, memories: Memory[]): Promise<DailyInsight | null> {
  const ai = getFirebaseAI();
  if (!ai) return null;

  const ageLabel = formatBabyAge(baby.birthDate);
  const recentNotes = recentNotesFor(memories);

  const model = getGenerativeModel(ai, {
    model: 'gemini-3.6-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: dailyThoughtSchema,
    },
  });

  const prompt = `You are a warm, knowledgeable parenting companion inside a baby memory-keeping app.
Baby: ${baby.name}, currently ${ageLabel} old.

Recent notes the parents wrote about ${baby.name}:
${recentNotes || '(no memories logged yet)'}

Write today's home-screen reflection for the parents. Ground it in ${baby.name}'s age and, when relevant, the recent notes above. Keep it warm and specific — never generic filler.`;

  const result = await model.generateContent(prompt);
  const parsed = JSON.parse(result.response.text()) as Partial<
    Pick<DailyInsight, 'reflection' | 'tip' | 'developmentalNote'>
  >;

  return toDailyInsight(ageLabel, memories, parsed);
}

export async function summarizeMemory(memory: Memory, baby: Baby): Promise<string> {
  await delay(700);
  const age = formatBabyAge(baby.birthDate, new Date(memory.capturedAt));
  return (
    `At ${age}, this moment with ${baby.name} feels tender and vivid. ` +
    `${memory.title} captures a ${memory.tags[0]?.replace('_', ' ') ?? 'everyday'} chapter — ` +
    `${memory.note.slice(0, 80)}${memory.note.length > 80 ? '…' : ''}`
  );
}

export async function suggestTagsFromImage(_uri?: string): Promise<string[]> {
  await delay(500);
  return ['everyday', 'family', 'first_moment'];
}

function isComplete(insight: DailyInsight | null): insight is DailyInsight {
  return Boolean(insight?.reflection && insight.tip && insight.developmentalNote);
}

export async function generateDailyThought(baby: Baby, memories: Memory[]): Promise<DailyInsight> {
  try {
    const viaProxy = await generateDailyThoughtWithProxy(baby, memories);
    if (isComplete(viaProxy)) return viaProxy;
  } catch (error) {
    console.warn('AI proxy daily thought failed, trying direct AI', error);
  }
  try {
    const viaAI = await generateDailyThoughtWithAI(baby, memories);
    if (isComplete(viaAI)) return viaAI;
  } catch (error) {
    console.warn('Daily AI thought generation failed, using fallback', error);
  }
  const fallback = buildDailyInsight(baby);
  fallback.memoryHighlightIds = memories.slice(0, 2).map((m) => m.id);
  return fallback;
}

export async function askParentingAssistant(
  question: string,
  baby: Baby
): Promise<string> {
  await delay(800);
  const age = formatBabyAge(baby.birthDate);
  return (
    `For a baby around ${age} like ${baby.name}, here's a gentle take on “${question}”: ` +
    `every child develops on their own timeline. Keep routines warm and consistent, ` +
    `watch for engagement cues, and check with your pediatrician for personalized guidance. ` +
    `(Connect OpenAI in Cloud Functions for live answers.)`
  );
}

export async function predictUpcomingMilestones(
  baby: Baby,
  achievedIds: string[]
): Promise<string[]> {
  await delay(400);
  return [
    'Pulls to stand may arrive soon — create safe cruising routes.',
    'Expect more intentional gestures and early word attempts.',
    'Object permanence play (hide-and-seek toys) will delight.',
  ].filter((_, i) => !achievedIds.includes(`pred_${i}`));
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
