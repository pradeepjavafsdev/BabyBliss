import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/ui/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { useApp } from '../../context/AppContext';
import { MEMORY_TAG_LABELS } from '../../data/presets';
import { suggestTagsFromImage, summarizeMemory } from '../../services/ai';
import { MemoryTag } from '../../types';
import { colors, fonts, spacing } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddMemory'>;

export function AddMemoryScreen({ navigation }: Props) {
  const { addMemory, updateMemory, baby, user } = useApp();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<MemoryTag[]>(['everyday']);
  const [mediaUri, setMediaUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: MemoryTag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to attach memories.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
      const suggested = (await suggestTagsFromImage(result.assets[0].uri)) as MemoryTag[];
      setTags((prev) => Array.from(new Set([...prev, ...suggested])));
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow camera access to capture moments.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Add a title', 'Give this memory a short name.');
      return;
    }
    setSaving(true);
    const created = addMemory({
      title: title.trim(),
      note: note.trim(),
      location: location.trim() || undefined,
      tags: tags.length ? tags : ['everyday'],
      mediaUri,
      mediaType: 'photo',
      capturedAt: new Date().toISOString(),
    });
    if (user?.isPremium && baby) {
      const summary = await summarizeMemory(created, baby);
      updateMemory(created.id, { aiSummary: summary });
    }
    setSaving(false);
    navigation.replace('MemoryDetail', { id: created.id });
  };

  return (
    <Screen title="New memory" subtitle="Capture a moment worth keeping.">
      <View style={styles.block}>
        <View style={styles.row}>
          <Button title="Camera" variant="secondary" onPress={takePhoto} style={styles.half} />
          <Button title="Library" variant="ghost" onPress={pickImage} style={styles.half} />
        </View>
        {mediaUri ? <Text style={styles.mediaOk}>Media attached ✓</Text> : null}
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="First park day" />
        <Input
          label="Notes"
          value={note}
          onChangeText={setNote}
          placeholder="What made this special?"
          multiline
          style={{ minHeight: 100, textAlignVertical: 'top', paddingTop: 14 }}
        />
        <Input label="Location" value={location} onChangeText={setLocation} placeholder="Optional" />
        <Text style={styles.label}>Tags</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
          {(Object.keys(MEMORY_TAG_LABELS) as MemoryTag[]).map((t) => (
            <Chip key={t} label={MEMORY_TAG_LABELS[t]} selected={tags.includes(t)} onPress={() => toggleTag(t)} />
          ))}
        </ScrollView>
        <Button title="Save memory" onPress={save} loading={saving} />
        <Button title="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
  mediaOk: { fontFamily: fonts.bodyMedium, color: colors.accent, fontSize: 13 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.inkSoft },
  tags: { gap: spacing.xs, paddingBottom: spacing.xs },
});
