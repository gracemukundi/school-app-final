import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LicencesTab() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Récupération des établissements
  const fetchLicences = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Note: API_URL contient déjà ".../api"
      const res = await axios.get(`${API_URL}/school`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchools(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      console.error("Erreur récupération:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLicences();
  }, [fetchLicences]);

  // Basculer le statut avec prolongation automatique
  const toggleLicence = async (schoolId: string, currentStatus: string) => {
    const isActivating = currentStatus !== 'active';
    const newStatus = isActivating ? 'active' : 'expired';
    const actionLabel = isActivating ? 'ACTIVER (30 jours)' : 'COUPER L\'ACCÈS';

    Alert.alert(
      "Contrôle EducApp",
      `Confirmez-vous l'action : ${actionLabel} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Confirmer", 
          style: isActivating ? 'default' : 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              
              // Préparation des données : si on active, on ajoute 30 jours par défaut
              const payload = { 
                status: newStatus,
                joursAjoutes: isActivating ? 30 : 0 
              };

              // APPEL API : Route correspondante au Backend corrigé
              const response = await axios.patch(
                `${API_URL}/school/${schoolId}/licence`, 
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (response.status === 200) {
                // ✅ MISE À JOUR UI OPTIMISTE
                setSchools(prev => prev.map(s => 
                  s._id === schoolId ? response.data.school : s
                ));

                Alert.alert("Succès", isActivating ? "Licence activée pour 30 jours." : "Accès suspendu.");
              }
            } catch (error: any) {
              const errorMsg = error.response?.data?.msg || "Vérifiez la connexion au serveur.";
              Alert.alert("Erreur", errorMsg);
              fetchLicences(); // Sync en cas d'échec
            }
          }
        }
      ]
    );
  };

  const renderLicenceItem = ({ item }: { item: any }) => {
    const status = item.licence?.status;
    const isActive = status === 'active';
    const expiration = item.licence?.dateFin ? new Date(item.licence.dateFin).toLocaleDateString() : 'Non définie';

    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.schoolName}>{item.nom}</Text>
          <Text style={styles.locationText}>📍 {item.ville || 'Kinshasa, RDC'}</Text>
          <Text style={styles.expiryText}>Expire le : {expiration}</Text>
          
          <View style={[styles.statusBadge, { backgroundColor: isActive ? '#dcfce7' : '#fee2e2' }]}>
            <View style={[styles.dot, { backgroundColor: isActive ? '#16a34a' : '#dc2626' }]} />
            <Text style={[styles.statusText, { color: isActive ? '#16a34a' : '#dc2626' }]}>
              {isActive ? 'SERVICE ACTIF' : 'SERVICE SUSPENDU'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.7}
          style={[styles.actionBtn, { backgroundColor: isActive ? '#fee2e2' : '#1e3a8a' }]}
          onPress={() => toggleLicence(item._id, status)}
        >
          <Ionicons 
            name={isActive ? "pause-circle" : "play-circle"} 
            size={22} 
            color={isActive ? "#dc2626" : "#fff"} 
          />
          <Text style={[styles.actionBtnText, { color: isActive ? "#dc2626" : "#fff" }]}>
            {isActive ? "Couper" : "Activer"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>EDUCAPP DRC</Text>
        <Text style={styles.title}>Gestion des accès</Text>
        <Text style={styles.subtitle}>Activation et prolongation des licences</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1e3a8a" />
        </View>
      ) : (
        <FlatList
          data={schools}
          keyExtractor={(item) => item._id}
          renderItem={renderLicenceItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchLicences} tintColor="#1e3a8a" />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.empty}>Aucun établissement trouvé</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    padding: 25, paddingTop: 60, paddingBottom: 30, 
    backgroundColor: '#fff', borderBottomLeftRadius: 35, borderBottomRightRadius: 35, 
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 
  },
  appName: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 2, marginBottom: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  list: { padding: 20, paddingBottom: 100 },
  card: { 
    backgroundColor: '#fff', borderRadius: 22, padding: 18, marginBottom: 15, 
    flexDirection: 'row', alignItems: 'center', elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  cardInfo: { flex: 1 },
  schoolName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  locationText: { fontSize: 12, color: '#94a3b8', marginTop: 3 },
  expiryText: { fontSize: 11, color: '#64748b', marginBottom: 8, fontStyle: 'italic' },
  statusBadge: { 
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', 
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  actionBtn: { 
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, 
    paddingVertical: 10, borderRadius: 14, marginLeft: 10 
  },
  actionBtnText: { fontWeight: 'bold', marginLeft: 6, fontSize: 13 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 15, fontSize: 15 }
});