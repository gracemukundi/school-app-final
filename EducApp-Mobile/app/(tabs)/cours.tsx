import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MATIERES = [
  { id: '1', nom: 'Mathématiques', lecons: 12, icone: 'calculator', couleur: '#3b82f6' },
  { id: '2', nom: 'Français', lecons: 8, icone: 'text', couleur: '#ef4444' },
  { id: '3', nom: 'Sciences', lecons: 5, icone: 'flask', couleur: '#10b981' },
  { id: '4', nom: 'Histoire-Géo', lecons: 10, icone: 'earth', couleur: '#f59e0b' },
];

export default function CoursTab() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Cours</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MATIERES}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({ pathname: '/lecons-liste', params: { matiere: item.nom } } as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.couleur + '15' }]}>
              <Ionicons name={item.icone as any} size={28} color={item.couleur} />
            </View>
            <View style={styles.info}>
              <Text style={styles.nom}>{item.nom}</Text>
              <Text style={styles.count}>{item.lecons} leçons</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1e293b' },
  searchButton: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 15, elevation: 2 },
  iconBox: { width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 15 },
  nom: { fontSize: 17, fontWeight: 'bold', color: '#1e293b' },
  count: { fontSize: 13, color: '#94a3b8', marginTop: 2 }
});