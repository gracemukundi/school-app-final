import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Image,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RoleSelectorScreen() {
  const router = useRouter();

  const handleRoleSelection = (role: string) => {
    switch (role) {
      case 'eleve':
        router.push('/login-eleve');
        break;
      case 'admin_ecole':
        router.push('/(tabs)/admin-dashboard' as any);
        break;
      case 'super_admin':
        Alert.alert("Direction Générale", "Accès sécurisé au Portail National RDC");
        break;
      default:
        Alert.alert("Information", `Le module ${role} est en cours de déploiement.`);
        break;
    }
  };

  const RoleRow = ({ title, desc, icon, color, role }: any) => (
    <TouchableOpacity 
      style={[styles.rowCard, { borderLeftColor: color }]} 
      onPress={() => handleRoleSelection(role)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SECTION LOGO ET NOM UNIQUEMENT (PAS DE BARRE AU DESSUS) */}
        <View style={styles.introSection}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.mainHeroLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>EducApp</Text>
          <Text style={styles.subtitle}>Sélectionnez votre profil d'accès</Text>
          <View style={styles.line} />
        </View>

        {/* LISTE DES RÔLES */}
        <View style={styles.list}>
          <RoleRow 
            title="Élève / Étudiant" 
            desc="Accès aux cours et résultats" 
            icon="school-outline" 
            color="#3b82f6" 
            role="eleve" 
          />
          <RoleRow 
            title="Parent d'élève" 
            desc="Suivi scolaire et paiements" 
            icon="people-outline" 
            color="#10b981" 
            role="parent" 
          />
          <RoleRow 
            title="Professeur" 
            desc="Gestion des classes et cotes" 
            icon="journal-outline" 
            color="#f59e0b" 
            role="enseignant" 
          />
          <RoleRow 
            title="Administrateur École" 
            desc="Gestion technique établissement" 
            icon="business-outline" 
            color="#8b5cf6" 
            role="admin_ecole" 
          />
          <RoleRow 
            title="Direction (Super Admin)" 
            desc="Portail National RDC" 
            icon="shield-checkmark-outline" 
            color="#1e3a8a" 
            role="super_admin" 
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>MINISTÈRE DE L'ENSEIGNEMENT • RDC</Text>
          <Text style={styles.version}>v1.0.6 • 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingVertical: 50 // Augmenté pour compenser l'absence de TopBar
  },
  introSection: { 
    alignItems: 'center', 
    marginBottom: 35 
  },
  mainHeroLogo: { 
    width: 100, 
    height: 100, 
    marginBottom: 10 
  },
  brandTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#1e3a8a' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#64748b', 
    marginTop: 5,
    fontWeight: '600'
  },
  line: { 
    width: 40, 
    height: 4, 
    backgroundColor: '#3b82f6', 
    borderRadius: 2, 
    marginTop: 15 
  },
  list: { 
    gap: 12 
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  textContainer: { 
    flex: 1, 
    marginLeft: 15 
  },
  roleTitle: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#1e293b' 
  },
  roleDesc: { 
    fontSize: 12, 
    color: '#94a3b8', 
    marginTop: 2 
  },
  footer: { 
    alignItems: 'center', 
    marginTop: 40 
  },
  footerText: { 
    fontSize: 11, 
    color: '#64748b', 
    fontWeight: 'bold', 
    letterSpacing: 0.5 
  },
  version: { 
    fontSize: 10, 
    color: '#cbd5e1', 
    marginTop: 5 
  }
});