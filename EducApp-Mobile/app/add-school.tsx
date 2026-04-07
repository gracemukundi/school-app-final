import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../constants/Config';
import { Ionicons } from '@expo/vector-icons';

export default function AddSchool() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // État du formulaire
  const [form, setForm] = useState({
    nom: '',
    adresse: '',
    ville: '',
    inviteCode: '',
    directeur: '',
    telephone: '',
    type: 'complexe' // Valeur par défaut
  });

  const handleCreate = async () => {
    // Validation rapide
    if (!form.nom || !form.inviteCode) {
      Alert.alert("Champs requis", "Le nom et le code d'invitation sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/school`, form);
      
      Alert.alert("Succès", "L'école a été enregistrée avec 30 jours de licence.");
      router.replace('/(tabs)'); // Retour au dashboard pour voir les nouvelles stats
    } catch (error: any) {
      console.error(error.response?.data);
      Alert.alert("Erreur", error.response?.data?.msg || "Impossible de créer l'école.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle École</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Informations Générales</Text>
        
        <View style={styles.inputGroup}>
          <Ionicons name="business-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput 
            placeholder="Nom de l'établissement" 
            style={styles.input} 
            value={form.nom}
            onChangeText={(t) => setForm({...form, nom: t})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="key-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput 
            placeholder="Code d'invitation (ex: KIN001)" 
            style={styles.input} 
            autoCapitalize="characters"
            value={form.inviteCode}
            onChangeText={(t) => setForm({...form, inviteCode: t.toUpperCase()})}
          />
        </View>

        <Text style={styles.label}>Localisation & Contact</Text>

        <TextInput 
          placeholder="Ville (ex: Kinshasa)" 
          style={styles.inputSimple} 
          value={form.ville}
          onChangeText={(t) => setForm({...form, ville: t})}
        />

        <TextInput 
          placeholder="Adresse complète" 
          style={styles.inputSimple} 
          value={form.adresse}
          onChangeText={(t) => setForm({...form, adresse: t})}
        />

        <TextInput 
          placeholder="Nom du Promoteur / Directeur" 
          style={styles.inputSimple} 
          value={form.directeur}
          onChangeText={(t) => setForm({...form, directeur: t})}
        />

        <TextInput 
          placeholder="Téléphone de contact" 
          style={styles.inputSimple} 
          keyboardType="phone-pad"
          value={form.telephone}
          onChangeText={(t) => setForm({...form, telephone: t})}
        />

        <TouchableOpacity 
          style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Enregistrer l'école</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e3a8a', marginLeft: 15 },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#64748b', marginBottom: 15, marginTop: 10 },
  inputGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16 },
  inputSimple: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  submitBtn: { 
    backgroundColor: '#1e3a8a', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 20,
    shadowColor: '#1e3a8a',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});