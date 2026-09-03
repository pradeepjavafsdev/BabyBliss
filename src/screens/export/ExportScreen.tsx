import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SoftCard } from '../../components/ui/Motion';
import { Chip } from '../../components/ui/Chip';
import { useApp } from '../../context/AppContext';
import { PDF_TEMPLATES } from '../../data/presets';
import { exportMemoryBookPdf, generateMemoryBookHtml, sharePdf } from '../../services/pdf';
import { PdfTemplateId } from '../../types';
import { colors, fonts, spacing } from '../../theme';

export function ExportScreen() {
  const { baby, memories, achievements, milestones, user } = useApp();
  const [template, setTemplate] = useState<PdfTemplateId>('soft_bloom');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  const exportPdf = async () => {
    if (!baby) return;
    const selected = PDF_TEMPLATES.find((t) => t.id === template);
    if (selected?.premium && !user?.isPremium) {
      Alert.alert('Premium template', 'Upgrade to unlock magazine layouts.');
      return;
    }
    setBusy(true);
    try {
      const html = await generateMemoryBookHtml({
        baby,
        memories,
        achievements,
        milestones,
        template,
        title: title.trim() || undefined,
      });
      const uri = await exportMemoryBookPdf(html);
      await sharePdf(uri);
    } catch (e) {
      Alert.alert('Export failed', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen title="Memory book" subtitle="Arrange moments into a print-ready keepsake.">
      <Input
        label="Cover title"
        value={title}
        onChangeText={setTitle}
        placeholder={baby ? `${baby.name}'s First Year` : 'Memory Book'}
      />

      <Text style={styles.label}>Template</Text>
      <View style={styles.templates}>
        {PDF_TEMPLATES.map((t) => {
          const locked = t.premium && !user?.isPremium;
          return (
            <SoftCard
              key={t.id}
              onPress={() => !locked && setTemplate(t.id)}
              style={[styles.template, template === t.id && styles.templateActive, locked && styles.locked]}
            >
              <Text style={styles.templateName}>
                {t.name}
                {t.premium ? ' ★' : ''}
              </Text>
              <Text style={styles.templateDesc}>{t.description}</Text>
            </SoftCard>
          );
        })}
      </View>

      <View style={styles.meta}>
        <Chip label={`${memories.length} memories`} tone="neutral" />
        <Chip label={`${achievements.length} milestones`} tone="accent" />
      </View>

      <Button title="Preview & export PDF" onPress={exportPdf} loading={busy} />
      <Text style={styles.hint}>
        Free templates included. Premium unlocks magazine layouts, unlimited cloud archives, and ePub export.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  templates: { gap: spacing.sm, marginBottom: spacing.lg },
  template: { gap: 4 },
  templateActive: { borderColor: colors.brand, borderWidth: 1.5 },
  locked: { opacity: 0.5 },
  templateName: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
  templateDesc: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  meta: { flexDirection: 'row', gap: 8, marginBottom: spacing.lg },
  hint: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: spacing.md, lineHeight: 18 },
});
