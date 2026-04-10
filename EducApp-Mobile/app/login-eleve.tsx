import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';

export default function StudentLoginScreen() {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    console.log("Tentative de connexion pour l'élève :", matricule);
    // Redirection vers l'accueil élève
    router.replace('/(tabs)/eleve-acceuil' as any);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      {/* En-tête avec TON LOGO PNG */}
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>EducApp-DRC</Text>
        <Text style={styles.subtitle}>Portail Élève</Text>
      </View>

      {/* Formulaire de connexion */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Matricule scolaire</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: ELEVE-001"
          placeholderTextColor="#9ca3af"
          value={matricule}
          onChangeText={setMatricule}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.linkText}>J'ai oublié mon mot de passe</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Institutionnel */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ministère de l'Enseignement • RDC</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', 
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 18,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  button: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#1e3a8a',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  }
});