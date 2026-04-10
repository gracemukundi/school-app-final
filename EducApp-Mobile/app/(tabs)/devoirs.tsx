import React, { useState } from 'react';
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

// Données fictives pour simuler les devoirs de Grace
const DEVOIRS_DATA = [
  { id: '1', titre: 'Exercices sur les fractions', matiere: 'Mathématiques', date: 'Demain, 08h00', urgent: true, statut: 'a-faire' },
  { id: '2', titre: 'Analyse du texte "Congo fleuve"', matiere: 'Français', date: '15 Avril', urgent: false, statut: 'a-faire' },
  { id: '3', titre: 'Dessin technique : La perspective', matiere: 'Arts', date: '18 Avril', urgent: false, statut: 'termine' },
  { id: '4', titre: 'Quiz sur la cellule végétale', matiere: 'Biologie', date: 'Fini hier', urgent: false, statut: 'termine' },
];

export default function DevoirsScreen() {
  const [filter, setFilter] = useState('a-faire'); // Pour filtrer entre "À faire" et "Terminé"

  const renderDevoir = ({ item }: { item: typeof DEVOIRS_DATA[0] }) => (
    <TouchableOpacity style={styles.card}>
      <View style={[styles.statusIndicator, { backgroundColor: item.statut === 'termine' ? '#10b981' : (item.urgent ? '#ef4444' : '#3b82f6') }]} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.matiereText}>{item.matiere}</Text>
          {item.urgent && item.statut !== 'termine' && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.titreDevoir}>{item.titre}</Text>
        
        <View style={styles.footerCard}>
          <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Ionicons 
          name={item.statut === 'termine' ? "checkmark-done-circle" : "arrow-up-circle"} 
          size={32} 
          color={item.statut === 'termine' ? "#10b981" : "#1e3a8a"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Devoirs</Text>
        <Text style={styles.headerSubtitle}>Tu as {DEVOIRS_DATA.filter(d => d.statut === 'a-faire').length} devoirs en attente</Text>
      </View>

      {/* FILTRES D'AFFICHAGE */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === 'a-faire' && styles.filterBtnActive]}
          onPress={() => setFilter('a-faire')}
        >
          <Text style={[styles.filterLabel, filter === 'a-faire' && styles.filterLabelActive]}>À faire</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === 'termine' && styles.filterBtnActive]}
          onPress={() => setFilter('termine')}
        >
          <Text style={[styles.filterLabel, filter === 'termine' && styles.filterLabelActive]}>Terminés</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={DEVOIRS_DATA.filter(d => d.statut === filter)}
        keyExtractor={item => item.id}
        renderItem={renderDevoir}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 25, paddingTop: 30, paddingBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { fontSize: 14, color: '#64748b', marginTop: 5 },
  
  filterContainer: { flexDirection: 'row', paddingHorizontal: 25, marginBottom: 20 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginRight: 10, backgroundColor: '#e2e8f0' },
  filterBtnActive: { backgroundColor: '#1e3a8a' },
  filterLabel: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  filterLabelActive: { color: '#ffffff' },

  listContainer: { paddingHorizontal: 25, paddingBottom: 100 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    marginBottom: 15, 
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  statusIndicator: { width: 6 },
  cardContent: { flex: 1, padding: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matiereText: { fontSize: 12, fontWeight: 'bold', color: '#3b82f6', textTransform: 'uppercase' },
  urgentBadge: { backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  urgentText: { fontSize: 10, color: '#ef4444', fontWeight: 'bold' },
  titreDevoir: { fontSize: 17, fontWeight: 'bold', color: '#1e293b', marginVertical: 8 },
  footerCard: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 13, color: '#94a3b8', marginLeft: 5 },
  actionButton: { paddingHorizontal: 15, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#f1f5f9' }
});