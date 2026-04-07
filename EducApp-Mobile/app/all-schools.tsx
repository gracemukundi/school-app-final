import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../constants/Config'; // Assure-toi que le chemin vers ton Config est bon

export default function AllSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${API_URL}/school`);
      setSchools(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des écoles:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchools();
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.schoolCard}
      onPress={() => router.push(`/school-details?id=${item._id}`)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="school-outline" size={24} color="#1e3a8a" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.schoolName}>{item.nom}</Text>
        <Text style={styles.schoolDirector}>{item.directeur}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: item.licence?.status === 'active' ? '#dcfce7' : '#fee2e2' }]}>
        <Text style={[styles.statusText, { color: item.licence?.status === 'active' ? '#16a34a' : '#dc2626' }]}>
          {item.licence?.status === 'active' ? 'Actif' : 'Expiré'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#1e3a8a" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tous les établissements</Text>
      </View>

      <FlatList
        data={schools}
        keyExtractor={(item: any) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune école enregistrée pour le moment.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 50, 
    backgroundColor: '#fff' 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#1e3a8a' },
  listContent: { padding: 20 },
  schoolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: { flex: 1, marginLeft: 15 },
  schoolName: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
  schoolDirector: { fontSize: 13, color: '#64748b' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#64748b' }
});