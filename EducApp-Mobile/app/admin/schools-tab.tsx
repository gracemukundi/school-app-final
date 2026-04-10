import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function SchoolsTab() {
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchSchools = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/school`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setSchools(data);
      setFilteredSchools(data);
    } catch (error) {
      console.error("Erreur chargement écoles:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  // Fonction de recherche
  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter(school => 
        school.nom.toLowerCase().includes(text.toLowerCase()) || 
        school.ville?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSchools(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchools();
  };

  const renderSchoolItem = ({ item }: { item: any }) => {
    const isActive = item.licence?.status === 'active';
    
    return (
      <TouchableOpacity 
        style={styles.schoolCard}
        onPress={() => router.push({ pathname: '/school-details', params: { id: item._id } } as any)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="business" size={24} color="#1e3a8a" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.schoolName} numberOfLines={1}>{item.nom}</Text>
            <Text style={styles.schoolLocation}>
              <Ionicons name="location-outline" size={12} /> {item.ville || 'Kinshasa'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isActive ? '#dcfce7' : '#fee2e2' }]}>
            <Text style={[styles.statusText, { color: isActive ? '#16a34a' : '#dc2626' }]}>
              {isActive ? 'Actif' : 'Expiré'}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerInfo}>Directeur: {item.directeur}</Text>
          <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header & Recherche */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Établissements</Text>
        <Text style={styles.subtitle}>{schools.length} écoles enregistrées</Text>
        
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94a3b8" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Rechercher une école..."
            style={styles.searchInput}
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredSchools}
          keyExtractor={(item) => item._id}
          renderItem={renderSchoolItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={50} color="#cbd5e1" />
              <Text style={styles.emptyText}>Aucune école trouvée</Text>
            </View>
          }
        />
      )}

      {/* Bouton Flottant pour ajouter une école */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/add-school' as any)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerSection: { padding: 25, paddingTop: 60, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 5 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 15, paddingHorizontal: 15, marginTop: 20, height: 50 },
  searchInput: { flex: 1, fontSize: 16, color: '#334155' },
  listContent: { padding: 20, paddingBottom: 100 },
  schoolCard: { backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 45, height: 45, backgroundColor: '#eff6ff', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  schoolName: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
  schoolLocation: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  footerInfo: { fontSize: 12, color: '#64748b' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#94a3b8', marginTop: 10 },
  fab: { position: 'absolute', bottom: 90, right: 20, width: 60, height: 60, backgroundColor: '#1e3a8a', borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});