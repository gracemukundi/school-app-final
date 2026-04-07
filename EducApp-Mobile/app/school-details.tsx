import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../constants/Config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. DÉFINITION DU TYPE (Pour supprimer les erreurs de type)
interface School {
  _id: string;
  nom: string;
  ville?: string;
  directeur?: string;
  inviteCode: string;
  email?: string;
  dateCreation?: string;
  createdAt?: string;
  licence?: {
    status: string;
    dateFin: string;
  };
}

export default function SchoolDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Utilisation de l'interface au lieu de <any>
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await axios.get(`${API_URL}/school/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchool(res.data);
      } catch (err) {
        console.error("Erreur détails école:", err);
        Alert.alert("Erreur", "Impossible de charger les détails");
      } finally {
        setLoading(false);
      }
    };

    if (id) getDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  // LOGIQUE DE SYNCHRONISATION
  const licence = school?.licence;
  const isExpired = licence?.dateFin ? new Date(licence.dateFin).getTime() < new Date().getTime() : true;
  const isActive = licence?.status === 'active' && !isExpired;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de l'école</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <View style={styles.mainCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="business" size={40} color="#1e3a8a" />
          </View>
          <Text style={styles.schoolName}>{school?.nom}</Text>
          <Text style={styles.schoolCity}>{school?.ville || 'Kinshasa, RDC'}</Text>
          
          <View style={[styles.statusBadge, { backgroundColor: isActive ? '#dcfce7' : '#fee2e2' }]}>
            <Text style={[styles.statusText, { color: isActive ? '#16a34a' : '#dc2626' }]}>
              {isActive ? 'LICENCE ACTIVE' : 'LICENCE EXPIRÉE / INACTIVE'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <InfoRow icon="person" label="Directeur" value={school?.directeur || 'Non spécifié'} />
          <InfoRow icon="key" label="Code d'invitation" value={school?.inviteCode || 'N/A'} color="#1e3a8a" />
          
          <InfoRow 
            icon="time" 
            label="Date d'expiration" 
            value={licence?.dateFin ? new Date(licence.dateFin).toLocaleDateString('fr-FR') : 'Non définie'} 
            color={isActive ? '#16a34a' : '#dc2626'}
          />

          <InfoRow icon="mail" label="Email Contact" value={school?.email || 'Non renseigné'} />
          
          <InfoRow 
            icon="calendar" 
            label="Enregistré le" 
            value={school ? new Date(school.dateCreation || school.createdAt || "").toLocaleDateString('fr-FR') : 'N/A'} 
          />
        </View>

        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => router.push({ 
            pathname: '/(tabs)/licences', 
            params: { schoolId: id as string } 
          } as any)}
        >
          <Text style={styles.actionBtnText}>Gérer la licence</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// 2. TYPAGE DES PROPS DE InfoRow
interface InfoRowProps {
  icon: any;
  label: string;
  value: string;
  color?: string;
}

function InfoRow({ icon, label, value, color = '#64748b' }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color="#94a3b8" style={{ marginRight: 15 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  backBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 12, marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    elevation: 4,
    marginBottom: 20
  },
  iconContainer: { width: 80, height: 80, backgroundColor: '#eff6ff', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  schoolName: { fontSize: 22, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center' },
  schoolCity: { fontSize: 14, color: '#94a3b8', marginBottom: 15 },
  statusBadge: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  infoSection: { backgroundColor: '#fff', borderRadius: 25, padding: 20, elevation: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoLabel: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
  infoValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  actionBtn: {
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginTop: 25,
    elevation: 3
  },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 10 }
});