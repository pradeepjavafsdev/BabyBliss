import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Baby, Memory, MilestoneAchievement, MilestoneDefinition, PdfTemplateId } from '../types';
import { formatBabyAge, formatShortDate } from '../utils/date';
import { MEMORY_TAG_LABELS } from '../data/presets';

export async function generateMemoryBookHtml(params: {
  baby: Baby;
  memories: Memory[];
  achievements: MilestoneAchievement[];
  milestones: MilestoneDefinition[];
  template: PdfTemplateId;
  title?: string;
}): Promise<string> {
  const { baby, memories, achievements, milestones, template, title } = params;
  const bookTitle = title ?? `${baby.name}'s Memory Book`;
  const age = formatBabyAge(baby.birthDate);
  const accent = template === 'soft_bloom' ? '#D4726A' : template === 'magazine' ? '#2A221F' : '#4A9B8C';

  const memoryBlocks = memories
    .slice()
    .sort((a, b) => +new Date(a.capturedAt) - +new Date(b.capturedAt))
    .map(
      (m) => `
      <div class="memory">
        <div class="media">${m.mediaUri ? `<img src="${m.mediaUri}" />` : `<div class="ph">${m.title.slice(0, 1)}</div>`}</div>
        <h3>${escapeHtml(m.title)}</h3>
        <p class="meta">${formatShortDate(m.capturedAt)}${m.location ? ` · ${escapeHtml(m.location)}` : ''}</p>
        <p class="note">${escapeHtml(m.note)}</p>
        <p class="tags">${m.tags.map((t) => MEMORY_TAG_LABELS[t] ?? t).join(' · ')}</p>
      </div>`
    )
    .join('');

  const milestoneBlocks = achievements
    .map((a) => {
      const def = milestones.find((m) => m.id === a.milestoneId);
      return `<li><strong>${escapeHtml(def?.title ?? 'Milestone')}</strong> — ${formatShortDate(a.achievedAt)}${
        a.note ? `: ${escapeHtml(a.note)}` : ''
      }</li>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { margin: 36px; }
  body { font-family: Georgia, serif; color: #2A221F; background: #FFF8F5; }
  .cover { text-align: center; padding: 80px 24px; page-break-after: always; background: linear-gradient(160deg,#FFE8DF,#FFF8F5,#EAF4F1); }
  .brand { font-size: 14px; letter-spacing: 3px; text-transform: uppercase; color: ${accent}; }
  h1 { font-size: 42px; margin: 16px 0 8px; }
  .tagline { font-style: italic; color: #5C534F; }
  .memory { margin: 28px 0; padding-bottom: 20px; border-bottom: 1px solid rgba(42,34,31,0.1); page-break-inside: avoid; }
  .media img, .ph { width: 100%; max-height: 320px; object-fit: cover; border-radius: 16px; background: #F6D5D1; }
  .ph { height: 180px; display:flex; align-items:center; justify-content:center; font-size: 64px; color: ${accent}; }
  h3 { margin: 12px 0 4px; font-size: 22px; }
  .meta, .tags { color: #8A817C; font-size: 12px; }
  .note { line-height: 1.5; }
  .milestones { page-break-before: always; }
  ul { line-height: 1.7; }
</style>
</head>
<body>
  <section class="cover">
    <div class="brand">BabyBliss</div>
    <h1>${escapeHtml(bookTitle)}</h1>
    <p class="tagline">Blissful Memories, Forever Treasured</p>
    <p>${escapeHtml(baby.name)} · Born ${formatShortDate(baby.birthDate)} · Now ${escapeHtml(age)}</p>
  </section>
  <section>
    <h2 style="color:${accent}">Memories</h2>
    ${memoryBlocks || '<p>No memories selected.</p>'}
  </section>
  <section class="milestones">
    <h2 style="color:${accent}">Milestones</h2>
    <ul>${milestoneBlocks || '<li>No milestones recorded yet.</li>'}</ul>
  </section>
</body>
</html>`;
}

export async function exportMemoryBookPdf(html: string): Promise<string> {
  const { uri } = await Print.printToFileAsync({ html });
  return uri;
}

export async function sharePdf(uri: string) {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share BabyBliss Memory Book',
      UTI: 'com.adobe.pdf',
    });
  }
  return uri;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
