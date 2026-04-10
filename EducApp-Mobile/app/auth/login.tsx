import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
// Correction du chemin d'importation : on remonte de deux niveaux (auth/ et app/)
import { API_URL } from '../../constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData { 
  id: string; 
  nom: string; 
  email: string; 
  role: string; 
}

export default function LoginScreen() {
  const router = useRouter();
  const { role, roleLabel } = useLocalSearchParams(); 
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

      // Vérification du rôle pour éviter qu'un élève se connecte sur l'interface Admin et vice-versa
      if (user.role !== role) {
        Alert.alert("Accès refusé", `Ce compte n'est pas un profil ${roleLabel || role}.`);
        setLoading(false);
        return;
      }

      // Stockage local des informations de session
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      // Redirection intelligente selon le rôle
      if (user.role === 'eleve') {
        router.replace('/(tabs)/eleve-acceuil');
      } else {
        router.replace('/admin/dashboard');
      }

    } catch (error: any) {
      console.log(error);
      Alert.alert("Échec", error.response?.data?.msg || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Bouton Retour */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.logo}>EducApp</Text>
        <Text style={styles.subtitle}>
          Connexion : <Text style={styles.roleHighlight}>{roleLabel || role}</Text>
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Identifiant</Text>
          <TextInput 
            placeholder={role === 'eleve' ? "Matricule ou Email" : "Email professionnel"} 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput 
            placeholder="Votre mot de passe" 
            style={styles.input} 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />

          <TouchableOpacity 
            style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPass}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  backBtn: { 
    padding: 20,
    marginTop: 10 
  },
  backText: { 
    color: '#64748b', 
    fontSize: 16,
    fontWeight: '500'
  },
  logo: { 
    fontSize: 42, 
    fontWeight: 'bold', 
    color: '#1e3a8a', 
    textAlign: 'center',
    marginBottom: 5
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#64748b', 
    fontSize: 18, 
    marginBottom: 40 
  },
  roleHighlight: {
    color: '#1e3a8a', 
    fontWeight: 'bold'
  },
  form: { 
    marginTop: 10 
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    marginLeft: 4
  },
  input: { 
    backgroundColor: '#f8fafc', 
    padding: 18, 
    borderRadius: 15, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    fontSize: 16
  },
  loginBtn: { 
    backgroundColor: '#1e3a8a', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  loginText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  forgotPass: {
    marginTop: 20,
    alignItems: 'center'
  },
  forgotText: {
    color: '#64748b',
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});