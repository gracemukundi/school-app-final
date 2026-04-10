import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Données fictives simulant les leçons d'une matière
const LECONS = [
  { id: '1', titre: 'Les fractions : Introduction', duree: '12:05', type: 'video', statut: 'termine' },
  { id: '2', titre: 'Additionner des fractions', duree: '15:20', type: 'video', statut: 'en-cours' },
  { id: '3', titre: 'Exercices pratiques (PDF)', duree: '2 MB', type: 'document', statut: 'a-faire' },
  { id: '4', titre: 'Problèmes complexes', duree: '10:45', type: 'video', statut: 'a-faire' },
  { id: '5', titre: 'Quiz récapitulatif', duree: '5 min', type: 'quiz', statut: 'a-faire' },
];

export default function LeconsListeScreen() {
  const router = useRouter();
  const { matiere } = useLocalSearchParams(); // Récupère le nom de la matière cliquée

  const renderLecon = ({ item, index }: { item: typeof LECONS[0], index: number }) => (
    <TouchableOpacity 
      style={styles.leconCard}
      onPress={() => console.log("Ouvrir la leçon", item.titre)}
    >
      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>
      
      <View style={styles.leconInfo}>
        <Text style={styles.leconTitle} numberOfLines={1}>{item.titre}</Text>
        <View style={styles.metaRow}>
          <Ionicons 
            name={item.type === 'video' ? 'play-circle' : 'document-text'} 
            size={14} 
            color="#94a3b8" 
          />
          <Text style={styles.metaText}>{item.duree}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        {item.statut === 'termine' ? (
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
        ) : item.statut === 'en-cours' ? (
          <Ionicons name="time" size={24} color="#3b82f6" />
        ) : (
          <Ionicons name="play-outline" size={24} color="#cbd5e1" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER DYNAMIQUE */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>Matière</Text>
          <Text style={styles.headerTitle}>{matiere || "Ma Leçon"}</Text>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="cloud-download-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* LISTE DES LEÇONS */}
      <FlatList
        data={LECONS}
        renderItem={renderLecon}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.progressionContainer}>
            <View style={styles.progressionTextRow}>
              <Text style={styles.progressionLabel}>Ton avancement</Text>
              <Text style={styles.progressionValue}>40%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '40%' }]} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  backButton: { padding: 8 },
  headerTitleContainer: { flex: 1, marginLeft: 15 },
  headerSubtitle: { fontSize: 12, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  downloadButton: { padding: 8 },

  progressionContainer: { padding: 20, backgroundColor: '#f8fafc', borderRadius: 20, margin: 20 },
  progressionTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressionLabel: { fontWeight: 'bold', color: '#475569' },
  progressionValue: { color: '#3b82f6', fontWeight: 'bold' },
  progressBarBg: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4 },
  progressBarFill: { height: 8, backgroundColor: '#3b82f6', borderRadius: 4 },

  listContent: { paddingBottom: 30 },
  leconCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc'
  },
  numberContainer: { width: 30 },
  numberText: { fontSize: 18, fontWeight: '900', color: '#e2e8f0' },
  leconInfo: { flex: 1, marginLeft: 10 },
  leconTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { fontSize: 12, color: '#94a3b8', marginLeft: 5 },
  statusContainer: { marginLeft: 10 }
});