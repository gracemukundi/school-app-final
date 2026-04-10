import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  SafeAreaView, TextInput, Image, ScrollView, Alert, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfile() {
  const router = useRouter();
  
  // États pour les informations de l'élève
  const [name, setName] = useState('Grace Mutombo');
  const [image, setImage] = useState<string | null>(null);

  // Fonction pour ouvrir la galerie photo
  const pickImage = async () => {
    // Demander la permission (automatique avec Expo sur les versions récentes)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Permet de recadrer l'image en carré
      aspect: [1, 1],
      quality: 0.7, // Compresse un peu pour les performances
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Fonction pour générer les initiales dynamiquement
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const handleSave = () => {
    Alert.alert("Succès", "Ton profil a été mis à jour avec succès !");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER AVEC BOUTON FERMER ET ENREGISTRER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>OK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* SECTION PHOTO / INITIALES */}
        <View style={styles.avatarPickerSection}>
          <TouchableOpacity style={styles.imageWrapper} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={styles.initialsCircle}>
                <Text style={styles.initialsText}>{getInitials(name)}</Text>
              </View>
            )}
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={18} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Changer la photo</Text>
        </View>

        {/* FORMULAIRE DE MODIFICATION */}
        <View style={styles.formSection}>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>NOM COMPLET</Text>
            <TextInput 
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Grace Mutombo"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>ADRESSE E-MAIL</Text>
            <TextInput 
              style={[styles.textInput, styles.inputDisabled]}
              value="grace.mutombo@educapp.cd"
              editable={false} // On ne change pas l'email ici
            />
            <Text style={styles.infoNote}>L'email est géré par l'administration de l'école.</Text>
          </View>
        </View>

        {/* SÉLECTEUR D'AVATARS RAPIDES (Optionnel) */}
        <View style={styles.quickAvatars}>
          <Text style={styles.inputLabel}>OU CHOISIR UN AVATAR</Text>
          <View style={styles.avatarGrid}>
            {['happy-outline', 'rocket-outline', 'school-outline', 'star-outline'].map((iconName, index) => (
              <TouchableOpacity key={index} style={styles.avatarItem} onPress={() => setImage(null)}>
                <Ionicons name={iconName as any} size={28} color="#1e3a8a" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  closeBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  saveBtn: { color: '#3b82f6', fontWeight: '800', fontSize: 16 },

  scrollContent: { paddingBottom: 40 },

  avatarPickerSection: { alignItems: 'center', marginVertical: 30 },
  imageWrapper: {
    width: 110,
    height: 110,
    borderRadius: 40,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileImage: { width: 110, height: 110, borderRadius: 40 },
  initialsCircle: {
    width: 110,
    height: 110,
    borderRadius: 40,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: { color: 'white', fontSize: 38, fontWeight: 'bold' },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#3b82f6',
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  changePhotoText: { marginTop: 15, color: '#64748b', fontSize: 13, fontWeight: '600' },

  formSection: { paddingHorizontal: 25, marginTop: 10 },
  inputBox: { marginBottom: 25 },
  inputLabel: { fontSize: 11, fontWeight: '900', color: '#94a3b8', marginBottom: 10, letterSpacing: 1 },
  textInput: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 15,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputDisabled: { backgroundColor: '#f1f5f9', color: '#94a3b8' },
  infoNote: { fontSize: 11, color: '#94a3b8', marginTop: 8, fontStyle: 'italic' },

  quickAvatars: { paddingHorizontal: 25, marginTop: 10 },
  avatarGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  avatarItem: {
    width: 60,
    height: 60,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  }
});