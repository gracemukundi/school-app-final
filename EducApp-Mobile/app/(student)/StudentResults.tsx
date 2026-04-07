import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StudentResults() {
  const [loading, setLoading] = useState(false);
  
  // DONNÉES SIMULÉES (À remplacer par l'appel API quand ton pote aura fini le Back)
  const [results] = useState([
    { id: '1', matiere: 'Mathématiques', obtenu: 34, max: 40, credit: 4 },
    { id: '2', matiere: 'Physique', obtenu: 12, max: 20, credit: 3 },
    { id: '3', matiere: 'Chimie', obtenu: 18, max: 20, credit: 3 },
    { id: '4', matiere: 'Philosophie', obtenu: 25, max: 40, credit: 2 },
    { id: '5', matiere: 'Anglais', obtenu: 15, max: 20, credit: 2 },
    { id: '6', matiere: 'Français', obtenu: 28, max: 40, credit: 3 },
  ]);

  // CALCULS DE PONDÉRATION AUTOMATIQUES
  const totalObtenu = results.reduce((acc, curr) => acc + curr.obtenu, 0);
  const totalMax = results.reduce((acc, curr) => acc + curr.max, 0);
  const pourcentage = ((totalObtenu / totalMax) * 100).toFixed(1);

  // Déterminer la mention
  const getMention = (p: number) => {
    if (p >= 80) return { label: 'Grande Distinction', color: '#16a34a' };
    if (p >= 70) return { label: 'Distinction', color: '#16a34a' };
    if (p >= 50) return { label: 'Satisfaction', color: '#1e3a8a' };
    return { label: 'Ajourné', color: '#dc2626' };
  };

  const mention = getMention(Number(pourcentage));

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#1e3a8a" /></View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. HEADER : LE VERDICT (POURCENTAGE) */}
      <View style={styles.resultHeader}>
        <Text style={styles.headerLabel}>Résultats 1ère Période</Text>
        <Text style={styles.bigPercentage}>{pourcentage}%</Text>
        <View style={[styles.mentionBadge, { backgroundColor: mention.color }]}>
          <Text style={styles.mentionText}>{mention.label}</Text>
        </View>
        <Text style={styles.totalPoints}>{totalObtenu} points sur {totalMax}</Text>
      </View>

      {/* 2. LISTE DÉTAILLÉE (PONDÉRATION) */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.columnTitle}>BRANCHE / MATIÈRE</Text>
          <Text style={styles.columnTitle}>POINTS</Text>
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.gradeItem}>
              <View style={styles.matiereBox}>
                <Text style={styles.matiereName}>{item.matiere}</Text>
                <Text style={styles.creditText}>{item.credit} Crédits</Text>
              </View>
              <View style={styles.pointsBox}>
                <Text style={styles.obtenuText}>{item.obtenu}</Text>
                <Text style={styles.maxText}>/{item.max}</Text>
                {/* Indicateur de réussite par matière */}
                <View style={[
                  styles.dot, 
                  { backgroundColor: (item.obtenu/item.max) >= 0.5 ? '#16a34a' : '#dc2626' }
                ]} />
              </View>
            </View>
          )}
        />
      </View>

      {/* 3. BOUTON D'ACTION */}
      <TouchableOpacity style={styles.btnDownload}>
        <Ionicons name="cloud-download-outline" size={20} color="#fff" />
        <Text style={styles.btnText}>Télécharger le bulletin complet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  resultHeader: { 
    backgroundColor: '#fff', padding: 30, borderRadius: 30, alignItems: 'center', 
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 
  },
  headerLabel: { fontSize: 14, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' },
  bigPercentage: { fontSize: 64, fontWeight: '900', color: '#1e3a8a', marginVertical: 5 },
  mentionBadge: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 50, marginBottom: 10 },
  mentionText: { color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  totalPoints: { fontSize: 16, color: '#64748b', fontWeight: '500' },

  listContainer: { flex: 1, marginTop: 25 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 10 },
  columnTitle: { fontSize: 11, color: '#94a3b8', fontWeight: 'bold' },

  gradeItem: { 
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', padding: 18, borderRadius: 20, marginBottom: 10, elevation: 1 
  },
  matiereBox: { flex: 1 },
  matiereName: { fontSize: 15, fontWeight: 'bold', color: '#334155' },
  creditText: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  
  pointsBox: { flexDirection: 'row', alignItems: 'baseline', paddingRight: 10 },
  obtenuText: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  maxText: { fontSize: 13, color: '#94a3b8', marginLeft: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, marginLeft: 10, alignSelf: 'center' },

  btnDownload: { 
    backgroundColor: '#1e3a8a', flexDirection: 'row', justifyContent: 'center', 
    alignItems: 'center', padding: 18, borderRadius: 20, marginVertical: 20 
  },
  btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 }
});