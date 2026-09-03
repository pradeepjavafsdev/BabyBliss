import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/ui/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { SoftCard } from '../../components/ui/Motion';
import { useApp } from '../../context/AppContext';
import { sendEmailInvite, sendShareInviteSms } from '../../services/twilio';
import { SharePermission } from '../../types';
import { createId } from '../../utils/date';
import { colors, fonts, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ShareMemory'>;

export function ShareMemoryScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { memories, baby, user, family, addFamilyMember } = useApp();
  const memory = memories.find((m) => m.id === id);
  const [permission, setPermission] = useState<SharePermission>('view');
  const [isPublic, setIsPublic] = useState(false);
  const [contact, setContact] = useState('');
  const [sending, setSending] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  if (!memory || !baby) {
    return (
      <Screen title="Share">
        <Text style={typography.body}>Memory not found.</Text>
      </Screen>
    );
  }

  const createLink = () => {
    const url = `https://babybliss.app/s/${createId('share')}`;
    setLink(url);
    return url;
  };

  const invite = async (via: 'sms' | 'email') => {
    if (!contact.trim()) {
      Alert.alert('Add a contact', 'Enter a phone number or email.');
      return;
    }
    setSending(true);
    const url = link ?? createLink();
    const payload = {
      to: contact.trim(),
      babyName: baby.name,
      shareUrl: url,
      inviterName: user?.name ?? 'A parent',
    };
    const result = via === 'sms' ? await sendShareInviteSms(payload) : await sendEmailInvite(payload);
    setSending(false);
    if (result.success) {
      addFamilyMember({
        name: contact.includes('@') ? contact.split('@')[0]! : contact,
        email: contact.includes('@') ? contact : undefined,
        phone: contact.includes('@') ? undefined : contact,
        relationship: 'Family',
        permission,
        avatarColor: permission === 'view' ? colors.accent : colors.brand,
      });
      Alert.alert('Invite sent', result.message);
    } else {
      Alert.alert('Could not send', result.message);
    }
  };

  return (
    <Screen title="Share memory" subtitle={memory.title}>
      <SoftCard style={styles.card}>
        <Text style={styles.label}>Permissions</Text>
        <View style={styles.row}>
          {(['view', 'comment', 'collaborate'] as SharePermission[]).map((p) => (
            <Chip key={p} label={p} selected={permission === p} onPress={() => setPermission(p)} />
          ))}
        </View>
        <View style={styles.row}>
          <Chip label="Private" selected={!isPublic} onPress={() => setIsPublic(false)} tone="neutral" />
          <Chip label="Public link" selected={isPublic} onPress={() => setIsPublic(true)} tone="accent" />
        </View>
      </SoftCard>

      <View style={styles.block}>
        <Input
          label="Invite by phone or email"
          value={contact}
          onChangeText={setContact}
          placeholder="+15551234567 or name@email.com"
          autoCapitalize="none"
        />
        <Button title="Create shareable link" variant="secondary" onPress={() => createLink()} />
        {link ? <Text style={styles.link}>{link}</Text> : null}
        <Button title="Send SMS invite (Twilio)" onPress={() => invite('sms')} loading={sending} />
        <Button title="Send email invite" variant="ghost" onPress={() => invite('email')} loading={sending} />
        <Button title="Manage family" variant="ghost" onPress={() => navigation.navigate('Family')} />
      </View>

      {family.length ? (
        <View style={styles.family}>
          <Text style={styles.label}>Family with access</Text>
          {family.map((f) => (
            <Text key={f.id} style={styles.member}>
              {f.name} · {f.permission}
            </Text>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, marginBottom: spacing.lg },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.inkSoft },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  block: { gap: spacing.sm },
  link: { fontFamily: fonts.body, fontSize: 13, color: colors.accent, marginVertical: 4 },
  family: { marginTop: spacing.xl, gap: 6 },
  member: { fontFamily: fonts.body, color: colors.inkSoft, fontSize: 14 },
});
