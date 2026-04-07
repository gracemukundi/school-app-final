import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, schoolsRes] = await Promise.allSettled([
        axios.get(`${API_URL}/stats/admin-dashboard`, { headers, timeout: 8000 }),
        axios.get(`${API_URL}/school`, { headers, timeout: 8000 })
      ]);

      if (statsRes.status === 'fulfilled') setData(statsRes.value.data);
      if (schoolsRes.status === 'fulfilled') setSchools(Array.isArray(schoolsRes.value.data) ? schoolsRes.value.data : []);

    } catch (error: any) {
      if (error.response?.status === 401) router.replace('/(tabs)/login' as any);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* --- HEADER ÉPURÉ & IDENTITAIRE --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>EDUCAPP DRC</Text>
          <Text style={styles.dashboardSubtitle}>Tableau de bord</Text>
        </View>
        
        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.settingsBtn} 
          onPress={() => router.push('/settings' as any)}
        >
          <Ionicons name="settings-sharp" size={24} color="#1e3a8a" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}
      >
        {/* État des Licences */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Licences en RDC</Text>
          <View style={styles.licenceCard}>
            <View style={styles.licenceRow}>
              <View>
                <Text style={styles.licenceValue}>{data?.licences?.actives || 0}</Text>
                <Text style={styles.licenceSub}>Actives</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.licenceValue, { color: '#dc2626' }]}>{data?.licences?.expirees || 0}</Text>
                <Text style={styles.licenceSub}>Expirées</Text>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: data?.licences?.tauxActivation || '0%', backgroundColor: '#1e3a8a' }]} />
            </View>
          </View>
        </View>

        {/* Grille Stats */}
        <View style={styles.statsGrid}>
          <StatCard title="Écoles" count={data?.counts?.ecoles} icon="business" color="#1e3a8a" />
          <StatCard title="Élèves" count={data?.counts?.eleves} icon="school" color="#b91c1c" />
          <StatCard title="Profs" count={data?.counts?.professeurs} icon="person-add" color="#0f766e" />
          <StatCard title="Parents" count={data?.counts?.parents} icon="people" color="#6d28d9" />
        </View>

        {/* Liste Rapide */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Écoles récentes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/schools-tab' as any)}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {schools.slice(0, 3).map((school) => (
            <TouchableOpacity 
              key={school._id} 
              style={styles.schoolItem} 
              onPress={() => router.push({ pathname: '/school-details', params: { id: school._id } } as any)}
            >
              <View style={styles.schoolIconBox}>
                  <Ionicons name="business-outline" size={20} color="#1e3a8a" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.schoolName}>{school.nom}</Text>
                  <Text style={styles.schoolLocation}>{school.ville || 'Kinshasa, RDC'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ title, count, icon, color }: any) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.cardCount}>{count || 0}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  header: { 
    paddingHorizontal: 25, paddingTop: 60, paddingBottom: 25, 
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomLeftRadius: 35, borderBottomRightRadius: 35, elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12
  },
  appName: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: '#1e3a8a', 
    letterSpacing: -0.5,
    textTransform: 'uppercase'
  },
  dashboardSubtitle: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#94a3b8', 
    marginTop: -4,
    letterSpacing: 1
  },
  settingsBtn: { 
    padding: 10, 
    backgroundColor: '#f1f5f9', 
    borderRadius: 15 
  },
  sectionContainer: { paddingHorizontal: 25, marginTop: 30 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },
  viewAll: { color: '#1e3a8a', fontWeight: 'bold' },
  licenceCard: { backgroundColor: '#fff', padding: 20, borderRadius: 25, elevation: 2 },
  licenceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  licenceValue: { fontSize: 22, fontWeight: 'bold', color: '#16a34a' },
  licenceSub: { fontSize: 12, color: '#94a3b8' },
  progressBarBg: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 25, marginTop: 20 },
  card: { backgroundColor: '#fff', width: '47%', padding: 15, borderRadius: 22, alignItems: 'center', elevation: 2, marginBottom: 15 },
  iconBox: { padding: 10, borderRadius: 15, marginBottom: 8 },
  cardCount: { fontSize: 20, fontWeight: 'bold', color: '#1e3a8a' },
  cardTitle: { fontSize: 13, color: '#64748b' },
  schoolItem: { backgroundColor: '#fff', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 1 },
  schoolIconBox: { width: 40, height: 40, backgroundColor: '#eff6ff', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  schoolName: { fontSize: 15, fontWeight: 'bold', color: '#334155' },
  schoolLocation: { fontSize: 12, color: '#94a3b8' }
});