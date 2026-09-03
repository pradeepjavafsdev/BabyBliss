import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SoftCard } from '../../components/ui/Motion';
import { useApp } from '../../context/AppContext';
import { sendEmailInvite, sendShareInviteSms } from '../../services/twilio';
import { colors, fonts, spacing } from '../../theme';

export function FamilyScreen() {
  const { family, addFamilyMember, removeFamilyMember, baby, user } = useApp();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [relationship, setRelationship] = useState('Grandparent');

  const invite = async () => {
    if (!name.trim() || !contact.trim() || !baby) return;
    addFamilyMember({
      name: name.trim(),
      email: contact.includes('@') ? contact.trim() : undefined,
      phone: contact.includes('@') ? undefined : contact.trim(),
      relationship: relationship.trim() || 'Family',
      permission: 'comment',
      avatarColor: colors.brand,
    });
    const payload = {
      to: contact.trim(),
      babyName: baby.name,
      shareUrl: 'https://babybliss.app/family/invite',
      inviterName: user?.name ?? 'Parent',
    };
    const result = contact.includes('@')
      ? await sendEmailInvite(payload)
      : await sendShareInviteSms(payload);
    Alert.alert(result.success ? 'Invited' : 'Saved locally', result.message);
    setName('');
    setContact('');
  };

  return (
    <Screen title="Family circle" subtitle="Control who can view and comment.">
      <View style={styles.form}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="Grandma Rose" />
        <Input label="Email or phone" value={contact} onChangeText={setContact} placeholder="rose@email.com" autoCapitalize="none" />
        <Input label="Relationship" value={relationship} onChangeText={setRelationship} placeholder="Grandmother" />
        <Button title="Add & invite" onPress={invite} />
      </View>

      <View style={styles.list}>
        {family.map((f) => (
          <SoftCard key={f.id} style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: f.avatarColor }]}>
              <Text style={styles.avatarText}>{f.name.slice(0, 1)}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name}>{f.name}</Text>
              <Text style={styles.meta}>
                {f.relationship} · {f.permission}
                {f.email ? ` · ${f.email}` : ''}
                {f.phone ? ` · ${f.phone}` : ''}
              </Text>
            </View>
            <Pressable onPress={() => removeFamilyMember(f.id)}>
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          </SoftCard>
        ))}
        {!family.length ? <Text style={styles.empty}>Invite grandparents and relatives to follow along.</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.sm, marginBottom: spacing.xl },
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bodyBold, color: colors.white },
  body: { flex: 1 },
  name: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  remove: { fontFamily: fonts.bodyMedium, color: colors.danger, fontSize: 12 },
  empty: { fontFamily: fonts.body, color: colors.muted },
});
