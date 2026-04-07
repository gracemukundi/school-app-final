import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Ajout de useLocalSearchParams
import { API_URL } from '../constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData { id: string; nom: string; email: string; role: string; }

export default function LoginScreen() {
  const router = useRouter();
  const { role, roleLabel } = useLocalSearchParams(); // On récupère le choix de l'utilisateur
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email: email.trim().toLowerCase(),
        password: password
      });

      const { token, user } = response.data as { token: string, user: UserData };

      // Vérification : Est-ce que le rôle correspond à celui choisi au début ?
      if (user.role !== role) {
        Alert.alert("Accès refusé", `Ce compte n'est pas un profil ${roleLabel}.`);
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert("Échec", error.response?.data?.msg || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>EducApp</Text>
      <Text style={styles.subtitle}>Connexion : <Text style={{color: '#1e3a8a', fontWeight: 'bold'}}>{roleLabel}</Text></Text>

      <View style={styles.form}>
        <TextInput 
          placeholder={role === 'eleve' ? "Matricule ou Email" : "Email professionnel"} 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput placeholder="Mot de passe" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Se connecter</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Utilise les mêmes styles que ton précédent LoginScreen avec ces ajouts :
const styles = StyleSheet.create({
  // ... tes styles précédents ...
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#fff' },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  backText: { color: '#64748b', fontSize: 16 },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#64748b', fontSize: 18, marginBottom: 30 },
  form: { marginTop: 10 },
  input: { backgroundColor: '#f8fafc', padding: 18, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  loginBtn: { backgroundColor: '#1e3a8a', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});