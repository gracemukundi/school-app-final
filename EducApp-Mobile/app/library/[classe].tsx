import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Simulation de données (Idéalement, elles viendraient d'une base de données)
const ALL_BOOKS = [
  { id: '1', title: 'Calcul Mental', color: '#e11d48', icon: 'calculator', classe: '6ème Primaire (TENAFEP)' },
  { id: '2', title: 'Grammaire', color: '#2563eb', icon: 'text', classe: '6ème Primaire (TENAFEP)' },
  { id: '3', title: 'Sciences', color: '#16a34a', icon: 'leaf', classe: '6ème Primaire (TENAFEP)' },
  { id: '4', title: 'Histoire', color: '#d97706', icon: 'map', classe: '6ème Primaire (TENAFEP)' },
  // Ajoute d'autres livres ici...
];

export default function AllBooksScreen() {
  const { classe } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // On filtre les livres selon la classe sélectionnée
  const filteredBooks = ALL_BOOKS.filter(b => b.classe === classe);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.bookCard, { backgroundColor: item.color }]}>
      <Ionicons name={item.icon} size={40} color="#fff" />
      <Text style={styles.bookTitle}>{item.title}</Text>
      <View style={styles.bookSpine} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER AVEC BOUTON RETOUR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e3a8a" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>Tous les livres</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{classe}</Text>
        </View>
      </View>

      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Affichage en grille (2 colonnes)
        contentContainerStyle={styles.gridPadding}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  backBtn: { padding: 10, backgroundColor: '#eff6ff', borderRadius: 12, marginRight: 15 },
  headerTitleContainer: { flex: 1 },
  headerSubtitle: { fontSize: 12, color: '#64748b', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  
  gridPadding: { padding: 15 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 20 },
  
  bookCard: {
    width: '47%', // Presque la moitié de l'écran
    height: 180,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bookTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bookSpine: { position: 'absolute', left: 0, top: 15, bottom: 15, width: 4, backgroundColor: 'rgba(0,0,0,0.1)' }
});