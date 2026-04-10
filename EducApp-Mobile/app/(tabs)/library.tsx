import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Données adaptées pour le Primaire et Secondaire
const RAYONS_SCOLAIRES = [
  {
    id: '1',
    classe: '6ème Primaire (TENAFEP)',
    matiere: 'Tronc Commun',
    livres: [
      { id: 'p1', title: 'Calcul Mental', color: '#e11d48', icon: 'calculator', type: 'Manuel' },
      { id: 'p2', title: 'Grammaire Française', color: '#2563eb', icon: 'text', type: 'Exercices' },
      { id: 'p3', title: 'Sciences de la Vie', color: '#16a34a', icon: 'leaf', type: 'Cours' },
    ]
  },
  {
    id: '2',
    classe: '1ère & 2ème Secondaire',
    matiere: 'Sciences & Lettres',
    livres: [
      { id: 's1', title: 'Algèbre I', color: '#7c3aed', icon: 'infinite', type: 'Livre' },
      { id: 's2', title: 'Histoire du Congo', color: '#d97706', icon: 'map', type: 'Manuel' },
      { id: 's3', title: 'Physique : Optique', color: '#0891b2', icon: 'sunny', type: 'TP' },
    ]
  },
  {
    id: '3',
    classe: 'Humanités (3ème - 6ème)',
    matiere: 'Option Math-Physique / Littéraire',
    livres: [
      { id: 'h1', title: 'Philosophie', color: '#4f46e5', icon: 'bulb', type: 'Cours' },
      { id: 'h2', title: 'Chimie Organique', color: '#be185d', icon: 'flask', type: 'Manuel' },
    ]
  }
];

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();

  const renderLivre = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.livreCard, { backgroundColor: item.color }]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.type}</Text>
      </View>
      <Ionicons name={item.icon} size={35} color="#fff" />
      <View>
        <Text style={styles.livreTitle}>{item.title}</Text>
      </View>
      <View style={styles.livreSpine} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Espace Études</Text>
          <Text style={styles.headerTitle}>Ma Bibliothèque</Text>
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={24} color="#1e3a8a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {RAYONS_SCOLAIRES.map((rayon) => (
          <View key={rayon.id} style={styles.rayonSection}>
            <View style={styles.rayonHeader}>
              <View>
                <Text style={styles.classeTitle}>{rayon.classe}</Text>
                <Text style={styles.matiereTitle}>{rayon.matiere}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </View>
            
            <View style={styles.shelfContainer}>
              <FlatList
                data={rayon.livres}
                renderItem={renderLivre}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listPadding}
              />
              {/* Le support du rayon */}
              <View style={styles.shelfBar} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  headerSubtitle: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1e3a8a' },
  searchBtn: { backgroundColor: '#f1f5f9', padding: 10, borderRadius: 12 },

  rayonSection: { marginTop: 20 },
  rayonHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    marginBottom: 10 
  },
  classeTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  matiereTitle: { fontSize: 13, color: '#64748b' },

  shelfContainer: { position: 'relative', paddingBottom: 15 },
  listPadding: { paddingHorizontal: 20 },
  livreCard: {
    width: 120,
    height: 165,
    borderRadius: 10,
    marginRight: 18,
    padding: 12,
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  badge: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 5 
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  livreTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', lineHeight: 18 },
  livreSpine: { 
    position: 'absolute', 
    left: 0, 
    top: 10, 
    bottom: 10, 
    width: 4, 
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2
  },
  
  shelfBar: {
    height: 8,
    backgroundColor: '#e2e8f0', 
    marginHorizontal: 15,
    borderRadius: 4,
    marginTop: -5,
    zIndex: -1,
    borderBottomWidth: 2,
    borderBottomColor: '#cbd5e1'
  }
});