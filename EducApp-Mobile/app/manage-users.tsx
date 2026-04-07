import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../constants/Config';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // États pour le formulaire
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger la liste");
    } finally {
      setLoading(false);
    }
  };
const handleAddUser = async () => {
  if (!nom || !email || !password) {
    Alert.alert("Erreur", "Tous les champs sont obligatoires");
    return;
  }

  try {
    console.log("Tentative d'envoi vers:", `${API_URL}/users/register`);
    
    const response = await axios.post(`${API_URL}/users/register`, {
      nom: nom.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: 'super-admin', // <--- TRÈS IMPORTANT : Utilise le TIRET '-'
    });

    console.log("Réponse serveur:", response.data);
    Alert.alert("Succès", "Ton compte Super-Admin est créé !");
    setModalVisible(false);
    setNom(''); setEmail(''); setPassword('');
    fetchUsers(); // Pour voir ton nom apparaître dans la liste
  } catch (error: any) {
    // Si ça rate, on affiche l'erreur exacte envoyée par MongoDB
    const errorMsg = error.response?.data?.error || error.response?.data?.msg || "Erreur inconnue";
    console.log("Détail de l'échec:", error.response?.data);
    Alert.alert("Échec de l'enregistrement", errorMsg);
  }

  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Utilisateurs</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View>
              <Text style={styles.userName}>{item.nom}</Text>
              <Text style={styles.userRole}>{item.role?.toUpperCase()}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
          </View>
        )}
      />

      {/* MODAL D'AJOUT */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvel Utilisateur</Text>
            
            <TextInput placeholder="Nom complet" style={styles.input} value={nom} onChangeText={setNom} />
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput placeholder="Mot de passe" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddUser} style={styles.saveBtn}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
  addBtn: { backgroundColor: '#1e3a8a', padding: 10, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  userCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 3 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#2d3436' },
  userRole: { fontSize: 12, color: '#1e3a8a', fontWeight: 'bold', backgroundColor: '#eef2ff', alignSelf: 'flex-start', paddingHorizontal: 8, borderRadius: 4, marginTop: 4 },
  userEmail: { color: '#636e72', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 25, borderRadius: 20, width: '85%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 15, padding: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { padding: 15 },
  saveBtn: { backgroundColor: '#1e3a8a', padding: 15, borderRadius: 10, minWidth: 100, alignItems: 'center' }
});