import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MemoryCard } from '../../components/memories/MemoryCard';
import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/EmptyState';
import { useApp } from '../../context/AppContext';
import { MEMORY_TAG_LABELS } from '../../data/presets';
import { MemoryTag } from '../../types';
import { colors, fonts, gradients, radii, spacing } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type ViewMode = 'timeline' | 'gallery';

export function MemoriesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { memories } = useApp();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<MemoryTag | 'all'>('all');
  const [mode, setMode] = useState<ViewMode>('timeline');

  const filtered = useMemo(() => {
    return memories
      .filter((m) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          m.title.toLowerCase().includes(q) ||
          m.note.toLowerCase().includes(q) ||
          (m.location ?? '').toLowerCase().includes(q);
        const matchesTag = tag === 'all' || m.tags.includes(tag);
        return matchesQuery && matchesTag;
      })
      .sort((a, b) => +new Date(b.capturedAt) - +new Date(a.capturedAt));
  }, [memories, query, tag]);

  const tags = ['all', ...Object.keys(MEMORY_TAG_LABELS)] as Array<MemoryTag | 'all'>;

  return (
    <View style={styles.root}>
      <LinearGradient colors={[...gradients.hero]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Memories</Text>
            <Text style={styles.sub}>{filtered.length} moments</Text>
          </View>
          <Pressable style={styles.addBtn} onPress={() => navigation.navigate('AddMemory')}>
            <Ionicons name="add" size={24} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes, places, titles"
            placeholderTextColor={colors.muted}
            style={styles.search}
          />
        </View>

        <View style={styles.modeRow}>
          <Chip label="Timeline" selected={mode === 'timeline'} onPress={() => setMode('timeline')} />
          <Chip label="Gallery" selected={mode === 'gallery'} onPress={() => setMode('gallery')} tone="accent" />
        </View>

        <FlatList
          horizontal
          data={tags}
          keyExtractor={(t) => t}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tags}
          renderItem={({ item }) => (
            <Chip
              label={item === 'all' ? 'All' : MEMORY_TAG_LABELS[item]}
              selected={tag === item}
              onPress={() => setTag(item)}
            />
          )}
        />

        {mode === 'gallery' ? (
          <FlatList
            data={filtered}
            keyExtractor={(m) => m.id}
            numColumns={2}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.galleryRow}
            ListEmptyComponent={
              <EmptyState title="No memories yet" message="Capture a photo or note to begin the timeline." />
            }
            renderItem={({ item }) => (
              <Pressable
                style={styles.galleryItem}
                onPress={() => navigation.navigate('MemoryDetail', { id: item.id })}
              >
                <View style={styles.galleryThumb}>
                  <Text style={styles.galleryLetter}>{item.title.slice(0, 1)}</Text>
                </View>
                <Text numberOfLines={1} style={styles.galleryTitle}>
                  {item.title}
                </Text>
              </Pressable>
            )}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            ListEmptyComponent={
              <EmptyState title="No memories yet" message="Capture a photo or note to begin the timeline." />
            }
            renderItem={({ item }) => (
              <Pressable onPress={() => navigation.navigate('MemoryDetail', { id: item.id })}>
                <MemoryCard memory={item} />
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  search: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  tags: { paddingHorizontal: spacing.lg, gap: spacing.xs, paddingVertical: spacing.md },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  galleryRow: { gap: spacing.sm },
  galleryItem: { flex: 1, marginBottom: spacing.sm },
  galleryThumb: {
    aspectRatio: 1,
    borderRadius: radii.md,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryLetter: { fontFamily: fonts.displayBold, fontSize: 36, color: colors.brandDeep },
  galleryTitle: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.ink, marginTop: 6 },
});
