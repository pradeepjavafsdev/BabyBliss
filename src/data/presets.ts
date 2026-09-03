import { MilestoneDefinition } from '../types';

export const PREDEFINED_MILESTONES: MilestoneDefinition[] = [
  // Physical
  { id: 'phys_smile', title: 'First smile', description: 'Social smile in response to a familiar face', category: 'physical', typicalAgeMonths: 2 },
  { id: 'phys_hold_head', title: 'Holds head steady', description: 'Can hold head upright without support', category: 'physical', typicalAgeMonths: 3 },
  { id: 'phys_roll', title: 'Rolls over', description: 'Rolls from tummy to back or back to tummy', category: 'physical', typicalAgeMonths: 4 },
  { id: 'phys_sit', title: 'Sits without support', description: 'Sits upright independently', category: 'physical', typicalAgeMonths: 6 },
  { id: 'phys_crawl', title: 'Crawls', description: 'Moves on hands and knees or scoots', category: 'physical', typicalAgeMonths: 8 },
  { id: 'phys_stand', title: 'Pulls to stand', description: 'Pulls up to standing using furniture', category: 'physical', typicalAgeMonths: 9 },
  { id: 'phys_cruise', title: 'Cruises furniture', description: 'Walks while holding onto furniture', category: 'physical', typicalAgeMonths: 10 },
  { id: 'phys_walk', title: 'First steps', description: 'Takes independent steps', category: 'physical', typicalAgeMonths: 12 },
  // Social
  { id: 'soc_coo', title: 'Cooing', description: 'Makes soft vowel sounds', category: 'social', typicalAgeMonths: 2 },
  { id: 'soc_laugh', title: 'First laugh', description: 'Laughs out loud in delight', category: 'social', typicalAgeMonths: 4 },
  { id: 'soc_faces', title: 'Recognizes faces', description: 'Shows preference for familiar people', category: 'social', typicalAgeMonths: 3 },
  { id: 'soc_stranger', title: 'Stranger awareness', description: 'Shows caution with unfamiliar people', category: 'social', typicalAgeMonths: 8 },
  { id: 'soc_wave', title: 'Waves bye-bye', description: 'Waves hello or goodbye', category: 'social', typicalAgeMonths: 10 },
  // Cognitive
  { id: 'cog_follow', title: 'Follows objects', description: 'Tracks moving objects with eyes', category: 'cognitive', typicalAgeMonths: 2 },
  { id: 'cog_reach', title: 'Reaches for toys', description: 'Intentionally reaches toward objects', category: 'cognitive', typicalAgeMonths: 4 },
  { id: 'cog_grasp', title: 'Grasps objects', description: 'Picks up and holds toys', category: 'cognitive', typicalAgeMonths: 5 },
  { id: 'cog_transfer', title: 'Transfers objects', description: 'Moves toy from one hand to the other', category: 'cognitive', typicalAgeMonths: 6 },
  { id: 'cog_pincer', title: 'Pincer grasp', description: 'Picks up small items with thumb and finger', category: 'cognitive', typicalAgeMonths: 9 },
  { id: 'cog_object', title: 'Object permanence', description: 'Looks for hidden objects', category: 'cognitive', typicalAgeMonths: 8 },
  // Language
  { id: 'lang_babble', title: 'Babbling', description: 'Repeats consonant-vowel sounds', category: 'language', typicalAgeMonths: 6 },
  { id: 'lang_mama', title: 'Says mama/dada', description: 'Uses mama or dada with meaning', category: 'language', typicalAgeMonths: 10 },
  { id: 'lang_first_word', title: 'First word', description: 'Says a clear first word beyond mama/dada', category: 'language', typicalAgeMonths: 12 },
  { id: 'lang_gestures', title: 'Uses gestures', description: 'Points or uses signs to communicate', category: 'language', typicalAgeMonths: 11 },
];

export const MEMORY_TAG_LABELS: Record<string, string> = {
  milestone: 'Milestone',
  first_moment: 'First moment',
  funny: 'Funny',
  achievement: 'Achievement',
  everyday: 'Everyday',
  family: 'Family',
  sleep: 'Sleep',
  feeding: 'Feeding',
  outdoors: 'Outdoors',
  custom: 'Custom',
};

export const REMINDER_TYPE_LABELS: Record<string, string> = {
  vaccination: 'Vaccination',
  doctor: 'Doctor visit',
  feeding: 'Feeding',
  sleep: 'Sleep',
  medicine: 'Medicine / vitamins',
  diaper: 'Diaper',
  photo: 'Photo reminder',
  custom: 'Custom',
};

export const PDF_TEMPLATES = [
  { id: 'classic' as const, name: 'Classic Keepsake', description: 'Soft covers, elegant captions', premium: false },
  { id: 'soft_bloom' as const, name: 'Soft Bloom', description: 'Warm peach pages with gentle accents', premium: false },
  { id: 'timeline' as const, name: 'Journey Timeline', description: 'Chronological story layout', premium: false },
  { id: 'magazine' as const, name: 'Magazine Spread', description: 'Designer editorial layouts', premium: true },
];
