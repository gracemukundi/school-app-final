import React, { useRef, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  Platform
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

const VIDEOS_DATA = [
  { 
    id: '1', 
    title: 'Introduction au Génie Logiciel', 
    teacher: 'Pr. Mutombo', 
    description: 'Comprendre le cycle de vie d\'un logiciel en 2 minutes.',
    url: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    likes: '1.2k'
  },
  { 
    id: '2', 
    title: 'Algorithmique : Les Tableaux', 
    teacher: 'Ir. Grace Mukundi', 
    description: 'Optimisation de la recherche dans un tableau trié.',
    url: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    likes: '850'
  },
  { 
    id: '3', 
    title: 'Base de données SQL', 
    teacher: 'Mme. Sarah', 
    description: 'Maîtriser les jointures INNER JOIN et LEFT JOIN.',
    url: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    likes: '2.4k'
  },
];

const VideoItem = ({ item, isActive, containerHeight }: any) => {
  return (
    <View style={[styles.videoContainer, { height: containerHeight }]}>
      <Video
        style={StyleSheet.absoluteFill}
        source={{ uri: item.url }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isActive}
        isLooping
        isMuted={false}
      />
      
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <View style={styles.teacherRow}>
            <Ionicons name="person-circle" size={22} color="#fff" />
            <Text style={styles.videoTeacher}>{item.teacher}</Text>
          </View>
          <Text style={styles.videoDesc} numberOfLines={2}>{item.description}</Text>
        </View>

        <View style={styles.rightBar}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="heart" size={35} color="#fff" />
            <Text style={styles.actionLabel}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-ellipses" size={30} color="#fff" />
            <Text style={styles.actionLabel}>Avis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="share-social" size={30} color="#fff" />
            <Text style={styles.actionLabel}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function VideocoursScreen() {
  const insets = useSafeAreaInsets();
  const [activeVideoId, setActiveVideoId] = useState(VIDEOS_DATA[0].id);

  // Calcul propre de la hauteur disponible
  const VIDEO_LIST_HEIGHT = useMemo(() => {
    const topInset = insets.top || 0;
    // On retire le header (environ 100px) et la barre de navigation (environ 70px)
    const calculatedHeight = WINDOW_HEIGHT - topInset - 170; 
    return calculatedHeight > 0 ? calculatedHeight : 600;
  }, [insets.top]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveVideoId(viewableItems[0].item.id);
    }
  });

  const renderItem = useCallback(({ item }: any) => (
    <VideoItem 
      item={item} 
      isActive={item.id === activeVideoId} 
      containerHeight={VIDEO_LIST_HEIGHT}
    />
  ), [activeVideoId, VIDEO_LIST_HEIGHT]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Videocours</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput 
            placeholder="Chercher un chapitre..." 
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <View style={styles.content}>
        <FlashList
          data={VIDEOS_DATA}
          renderItem={renderItem}
          estimatedItemSize={600} // Utilisation d'une valeur fixe sûre pour éviter les erreurs de calcul au rendu
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          extraData={activeVideoId}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    paddingHorizontal: 20, 
    paddingBottom: 15, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    zIndex: 10
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 12 },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f5f9', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    height: 45 
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#1e293b' },

  content: { flex: 1, backgroundColor: '#000' },
  videoContainer: { 
    width: WINDOW_WIDTH,
    backgroundColor: '#000'
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)', 
  },
  textContainer: { flex: 1, marginBottom: 10 },
  videoTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    textShadowColor: '#000', 
    textShadowRadius: 2 
  },
  teacherRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  videoTeacher: { color: '#fff', marginLeft: 6, fontWeight: '600', fontSize: 15 }, // <-- Corrigé ici
  videoDesc: { color: '#cbd5e1', fontSize: 13, lineHeight: 18 },

  rightBar: { alignItems: 'center', marginLeft: 10, marginBottom: 10 },
  actionBtn: { alignItems: 'center', marginVertical: 12 },
  actionLabel: { color: '#fff', fontSize: 11, marginTop: 4, fontWeight: 'bold' }
});