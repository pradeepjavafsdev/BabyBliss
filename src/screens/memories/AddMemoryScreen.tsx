import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/ui/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { MemoryPhoto } from '../../components/memories/MemoryPhoto';
import { useApp } from '../../context/AppContext';
import { MEMORY_TAG_LABELS } from '../../data/presets';
import { suggestTagsFromImage, summarizeMemory } from '../../services/ai';
import { uploadMemoryMedia } from '../../services/media';
import { MemoryTag } from '../../types';
import { createId } from '../../utils/date';
import { colors, fonts, radii, spacing } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddMemory'>;

export function AddMemoryScreen({ navigation }: Props) {
  const { addMemory, updateMemory, baby, user } = useApp();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<MemoryTag[]>(['everyday']);
  const [mediaUri, setMediaUri] = useState<string | undefined>();
  const [mediaMime, setMediaMime] = useState<string | undefined>();
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: MemoryTag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const attachAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    setMediaUri(asset.uri);
    setMediaMime(asset.mimeType);
    setMediaType(asset.type === 'video' ? 'video' : 'photo');
    if (asset.type !== 'video') {
      const suggested = (await suggestTagsFromImage(asset.uri)) as MemoryTag[];
      setTags((prev) => Array.from(new Set([...prev, ...suggested])));
    }
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
      await attachAsset(result.assets[0]);
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
      await attachAsset(result.assets[0]);
    }
  };

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Add a title', 'Give this memory a short name.');
      return;
    }
    setSaving(true);
    try {
      const memoryId = createId('mem');
      const babyId = baby?.id ?? 'baby_unknown';
      let storedUri = mediaUri;
      if (mediaUri) {
        try {
          storedUri = await uploadMemoryMedia(mediaUri, babyId, memoryId, mediaMime);
        } catch (error) {
          console.warn('Memory photo upload failed', error);
          Alert.alert(
            'Photo not uploaded',
            'Could not save the picture to Firebase Storage. The memory will still be saved without a cloud photo.'
          );
          storedUri = undefined;
        }
      }

      const created = addMemory({
        id: memoryId,
        title: title.trim(),
        note: note.trim(),
        location: location.trim() || undefined,
        tags: tags.length ? tags : ['everyday'],
        mediaUri: storedUri,
        mediaType,
        capturedAt: new Date().toISOString(),
      });

      if (user?.isPremium && baby) {
        const summary = await summarizeMemory(created, baby);
        updateMemory(created.id, { aiSummary: summary });
      }
      navigation.replace('MemoryDetail', { id: created.id });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen title="New memory" subtitle="Capture a moment worth keeping." mascot="memories">
      <View style={styles.block}>
        <View style={styles.row}>
          <Button title="Camera" variant="secondary" onPress={takePhoto} style={styles.half} />
          <Button title="Library" variant="ghost" onPress={pickImage} style={styles.half} />
        </View>
        {mediaUri ? (
          <View style={styles.preview}>
            <MemoryPhoto uri={mediaUri} title={title || 'New memory'} letterSize={28} />
          </View>
        ) : null}
        {mediaUri ? <Text style={styles.mediaOk}>Photo ready to save</Text> : null}
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
  preview: {
    height: 180,
    borderRadius: radii.clay,
    overflow: 'hidden',
  },
  mediaOk: { fontFamily: fonts.bodyMedium, color: colors.accent, fontSize: 13 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.inkSoft },
  tags: { gap: spacing.xs, paddingBottom: spacing.xs },
});
