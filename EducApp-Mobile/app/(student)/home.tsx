import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function StudentDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 1. HEADER DYNAMIQUE */}
      <View style={styles.header}>
        <View>
          <Text style={styles.userClass}>6ème Scientifique</Text>
          <Text style={styles.userName}>Grâce Mukundi 🇨🇩</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.notifBadge}>
          <Ionicons name="notifications-outline" size={26} color="#1e3a8a" />
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 2. BARRE DE RECHERCHE INTELLIGENTE */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput 
            placeholder="Trouver un chapitre ou un quiz..." 
            style={styles.searchInput} 
          />
        </View>

        {/* 3. WIDGET "ALERTE ÉCOLE" (URGENT) */}
        <View style={styles.alertCard}>
          <Ionicons name="megaphone" size={24} color="#fff" />
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.alertTitle}>Annonce Officielle</Text>
            <Text style={styles.alertText}>L'interrogation de Physique est reportée à lundi 08:00.</Text>
          </View>
        </View>

        {/* 4. GRILLE DES FONCTIONNALITÉS (LES 4 PILIERS) */}
        <Text style={styles.sectionTitle}>Mon Apprentissage</Text>
        <View style={styles.grid}>
          <FeatureCard 
            name="Bibliothèque" 
            desc="PDF & Manuels" 
            icon="book" 
            color="#3b82f6" 
            onPress={() => router.push('/library')} 
          />
          <FeatureCard 
            name="Vidéos" 
            desc="Cours filmés" 
            icon="play-circle" 
            color="#ef4444" 
            onPress={() => router.push('/videos')} 
          />
          <FeatureCard 
            name="Auto-Tests" 
            desc="Quiz & QCM" 
            icon="checkbox" 
            color="#8b5cf6" 
            onPress={() => router.push('/quizzes')} 
          />
          <FeatureCard 
            name="Résultats" 
            desc="Mes Points" 
            icon="stats-chart" 
            color="#10b981" 
            onPress={() => router.push('/grades')} 
          />
        </View>

        {/* 5. SECTION "VIE SCOLAIRE" (HORAIRE & FRAIS) */}
        <Text style={styles.sectionTitle}>Ma Scolarité</Text>
        <View style={styles.rowActions}>
           <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="calendar-outline" size={22} color="#1e3a8a" />
              <Text style={styles.actionText}>Mon Horaire</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="wallet-outline" size={22} color="#1e3a8a" />
              <Text style={styles.actionText}>Frais Scolaires</Text>
           </TouchableOpacity>
        </View>

        {/* 6. MODE HORS-LIGNE (ACCÈS RAPIDE) */}
        <TouchableOpacity style={styles.offlineBanner}>
           <View style={styles.offlineInfo}>
              <Text style={styles.offlineTitle}>Mes Téléchargements</Text>
              <Text style={styles.offlineSub}>3 livres et 1 vidéo disponibles</Text>
           </View>
           <Ionicons name="download-outline" size={24} color="#1e3a8a" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// --- SOUS-COMPOSANT : CARTE DE FONCTIONNALITÉ ---
function FeatureCard({ name, desc, icon, color, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text style={styles.cardName}>{name}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd', paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userClass: { fontSize: 13, color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1e3a8a' },
  notifBadge: { padding: 10, backgroundColor: '#f1f5f9', borderRadius: 15 },
  dot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 4, borderWidth: 1, borderColor: '#fff' },
  
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', padding: 12, borderRadius: 18, marginBottom: 20 },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 15 },

  alertCard: { backgroundColor: '#1e3a8a', padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 4, marginBottom: 25 },
  alertTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  alertText: { color: '#bfdbfe', fontSize: 13, marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#334155', marginBottom: 15, marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  card: { width: '47%', backgroundColor: '#fff', padding: 20, borderRadius: 22, marginBottom: 15, elevation: 2, borderWeight: 1, borderColor: '#f1f5f9' },
  iconCircle: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
  cardDesc: { fontSize: 11, color: '#94a3b8', marginTop: 3 },

  rowActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionBtn: { width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 18, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  actionText: { marginLeft: 10, fontWeight: '600', color: '#1e3a8a', fontSize: 13 },

  offlineBanner: { backgroundColor: '#eff6ff', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderStyle: 'dashed', borderWidth: 1, borderColor: '#3b82f6' },
  offlineInfo: { flex: 1 },
  offlineTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e3a8a' },
  offlineSub: { fontSize: 12, color: '#64748b', marginTop: 2 }
});