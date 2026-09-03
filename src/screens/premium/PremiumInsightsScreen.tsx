import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/ui/Screen';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SoftCard, FadeIn } from '../../components/ui/Motion';
import { useApp } from '../../context/AppContext';
import {
  askParentingAssistant,
  generateDailyThought,
  predictUpcomingMilestones,
} from '../../services/ai';
import { DailyInsight } from '../../types';
import { colors, fonts, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

export function PremiumInsightsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { baby, memories, achievements, user, setPremium, growth } = useApp();
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!baby) return;
    void (async () => {
      const daily = await generateDailyThought(baby, memories);
      setInsight(daily);
      const preds = await predictUpcomingMilestones(
        baby,
        achievements.map((a) => a.milestoneId)
      );
      setPredictions(preds);
    })();
  }, [baby, memories, achievements]);

  if (!baby) return null;

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const res = await askParentingAssistant(question.trim(), baby);
    setAnswer(res);
    setLoading(false);
  };

  return (
    <Screen
      title="AI insights"
      subtitle={user?.isPremium ? 'Premium unlocked' : 'Preview mode — upgrade for full assistant'}
    >
      {!user?.isPremium ? (
        <FadeIn>
          <SoftCard style={styles.upsell}>
            <Text style={styles.upsellTitle}>Unlock BabyBliss Premium</Text>
            <Text style={styles.upsellBody}>
              Vision summaries, daily thoughts, growth analytics, multi-baby support, highlight videos, and unlimited archives.
            </Text>
            <Button title="Enable premium (demo)" variant="premium" onPress={() => setPremium(true)} />
          </SoftCard>
        </FadeIn>
      ) : null}

      {insight ? (
        <FadeIn delay={80}>
          <SoftCard style={styles.block}>
            <Text style={styles.label}>Daily thought · {insight.babyAgeLabel}</Text>
            <Text style={styles.reflection}>{insight.reflection}</Text>
            <Text style={styles.tip}>{insight.tip}</Text>
            <Text style={styles.dev}>{insight.developmentalNote}</Text>
          </SoftCard>
        </FadeIn>
      ) : null}

      <FadeIn delay={140}>
        <SoftCard style={styles.block}>
          <Text style={styles.label}>Milestone predictions</Text>
          {predictions.map((p) => (
            <Text key={p} style={styles.pred}>
              · {p}
            </Text>
          ))}
        </SoftCard>
      </FadeIn>

      <FadeIn delay={200}>
        <SoftCard style={styles.block}>
          <Text style={styles.label}>Growth snapshot</Text>
          {growth.length ? (
            growth.map((g) => (
              <Text key={g.id} style={styles.pred}>
                {new Date(g.date).toLocaleDateString()} — {g.weightKg} kg · {g.heightCm} cm
              </Text>
            ))
          ) : (
            <Text style={styles.pred}>Add height/weight in Profile to unlock charts.</Text>
          )}
          <Button title="Analytics" variant="secondary" onPress={() => navigation.navigate('Analytics')} />
        </SoftCard>
      </FadeIn>

      <FadeIn delay={260}>
        <View style={styles.ask}>
          <Text style={styles.label}>Memory AI assistant</Text>
          <Input
            value={question}
            onChangeText={setQuestion}
            placeholder="Is it early for first words?"
          />
          <Button title="Ask" onPress={ask} loading={loading} disabled={!user?.isPremium} />
          {!user?.isPremium ? (
            <Text style={styles.lock}>Premium required for live Q&A</Text>
          ) : null}
          {answer ? <Text style={styles.answer}>{answer}</Text> : null}
        </View>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  upsell: { gap: spacing.sm, marginBottom: spacing.lg, backgroundColor: colors.ink },
  upsellTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.premiumSoft },
  upsellBody: { fontFamily: fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },
  block: { gap: spacing.sm, marginBottom: spacing.lg },
  label: { fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.muted },
  reflection: { fontFamily: fonts.handwritten, fontSize: 24, lineHeight: 30, color: colors.ink },
  tip: { ...typography.body },
  dev: { fontFamily: fonts.body, fontSize: 13, color: colors.accentDeep },
  pred: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft, lineHeight: 20 },
  ask: { gap: spacing.sm, marginBottom: spacing.xl },
  lock: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  answer: { fontFamily: fonts.body, fontSize: 15, color: colors.ink, lineHeight: 22, marginTop: spacing.sm },
});
