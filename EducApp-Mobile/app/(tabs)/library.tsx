import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LibraryTab() {
  const [activeTab, setActiveTab] = useState<'books' | 'videos'>('books');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState(''); 
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  // Récupération des données depuis l'API
  const fetchLibrary = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/library?type=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erreur de chargement bibliothèque:", error);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [activeTab]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
    
    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!title || (activeTab === 'books' && !selectedFile) || (activeTab === 'videos' && !link)) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = new FormData();
      data.append('title', title);
      data.append('type', activeTab);

      if (activeTab === 'books') {
         data.append('file', {
            uri: selectedFile.uri,
            name: selectedFile.name,
            type: 'application/pdf',
         } as any);
      } else {
        data.append('url', link);
      }

      await axios.post(`${API_URL}/library`, data, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
        }
      });

      Alert.alert("Succès", "Contenu ajouté à la bibliothèque");
      setTitle('');
      setLink('');
      setSelectedFile(null);
      fetchLibrary();
    } catch (error) {
      Alert.alert("Erreur", "L'envoi a échoué. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = (id: string) => {
    Alert.alert("Suppression", "Voulez-vous supprimer ce contenu ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(`${API_URL}/library/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            fetchLibrary();
          } catch (e) {
            Alert.alert("Erreur", "Impossible de supprimer");
          }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bibliothèque</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'books' && styles.activeTab]} 
            onPress={() => setActiveTab('books')}
          >
            <Text style={[styles.tabText, activeTab === 'books' && styles.activeTabText]}>Livres PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'videos' && styles.activeTab]} 
            onPress={() => setActiveTab('videos')}
          >
            <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>Cours Vidéo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.label}>Titre du {activeTab === 'books' ? 'livre' : 'cours'}</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Mathématiques 2nde G" 
            value={title}
            onChangeText={setTitle}
          />

          {activeTab === 'books' ? (
            <TouchableOpacity style={styles.filePicker} onPress={pickDocument}>
              <Ionicons name="document-attach" size={24} color="#1e3a8a" />
              <Text style={styles.filePickerText}>
                {selectedFile ? selectedFile.name : "Sélectionner le PDF"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.label}>Lien de la vidéo (YouTube/Vimeo)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="https://youtube.com/watch?v=..." 
                value={link}
                onChangeText={setLink}
              />
            </>
          )}

          <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="cloud-upload" size={20} color="#fff" />
                <Text style={styles.uploadBtnText}>Publier maintenant</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Contenus publiés</Text>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={40} color="#cbd5e1" />
            <Text style={styles.empty}>Aucun contenu pour le moment</Text>
          </View>
        ) : (
          items.map((item, index) => (
            <View key={item._id || index} style={styles.itemRow}>
              <Ionicons name={activeTab === 'books' ? "document-text" : "play-circle"} size={24} color="#1e3a8a" />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteItem(item._id)}>
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 25, paddingTop: 60, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 15, marginTop: 20, padding: 5 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#fff', elevation: 2 },
  tabText: { color: '#94a3b8', fontWeight: 'bold' },
  activeTabText: { color: '#1e3a8a' },
  formContainer: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 2, marginBottom: 30 },
  label: { fontSize: 13, color: '#94a3b8', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  filePicker: { flexDirection: 'row', alignItems: 'center', padding: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', borderRadius: 15, marginBottom: 20 },
  filePickerText: { marginLeft: 15, color: '#64748b', fontSize: 14, flex: 1 },
  uploadBtn: { backgroundColor: '#1e3a8a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 15, elevation: 3 },
  uploadBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginBottom: 15 },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, elevation: 1 },
  itemTitle: { color: '#334155', fontWeight: '500' },
  emptyContainer: { alignItems: 'center', marginTop: 20 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 10 }
});