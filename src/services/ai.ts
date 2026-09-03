import { Baby, DailyInsight, Memory } from '../types';
import { formatBabyAge } from '../utils/date';
import { buildDailyInsight } from '../data/demo';

/**
 * AI services stub — wire to OpenAI / Google Vision via Cloud Functions.
 */

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

export async function generateDailyThought(baby: Baby, memories: Memory[]): Promise<DailyInsight> {
  await delay(500);
  const insight = buildDailyInsight(baby);
  insight.memoryHighlightIds = memories.slice(0, 2).map((m) => m.id);
  return insight;
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
