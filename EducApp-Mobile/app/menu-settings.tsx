import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MenuSettingsScreen() {
  const router = useRouter();

  const MenuItem = ({ icon, title, subtitle, onPress, color = "#1e3a8a" }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER AVEC FLÈCHE RETOUR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu & Paramètres</Text>
        <View style={{ width: 40 }} /> {/* Équilibreur visuel */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFIL CARD */}
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>GM</Text>
          </View>
          <Text style={styles.userName}>Grace Mutombo</Text>
          <Text style={styles.userEmail}>grace.mutombo@educapp.cd</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        {/* OPTIONS DU MENU */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MON COMPTE</Text>
          <MenuItem 
            icon="person-outline" 
            title="Informations Personnelles" 
            subtitle="Nom, Post-nom, Matricule"
          />
          <MenuItem 
            icon="lock-closed-outline" 
            title="Sécurité" 
            subtitle="Changer mon mot de passe"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACADÉMIQUE</Text>
          <MenuItem 
            icon="ribbon-outline" 
            title="Mes Certificats" 
            color="#10b981"
          />
          <MenuItem 
            icon="calendar-outline" 
            title="Calendrier Scolaire" 
            color="#f59e0b"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AUTRES</Text>
          <MenuItem 
            icon="help-circle-outline" 
            title="Assistance technique" 
          />
          <MenuItem 
            icon="log-out-outline" 
            title="Déconnexion" 
            color="#ef4444"
            onPress={() => router.replace('/')}
          />
        </View>

        <Text style={styles.footerText}>EducApp v1.0.6 • DRC 🇨🇩</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  
  profileSection: { alignItems: 'center', padding: 30, backgroundColor: '#fff' },
  avatarLarge: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#1e3a8a', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 15
  },
  avatarTextLarge: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  userEmail: { fontSize: 14, color: '#64748b', marginTop: 5 },
  editBtn: { 
    marginTop: 15, 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#3b82f6' 
  },
  editBtnText: { color: '#3b82f6', fontWeight: 'bold', fontSize: 13 },

  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 10, marginLeft: 10 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10 
  },
  iconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, marginLeft: 15 },
  menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  menuSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  footerText: { textAlign: 'center', color: '#cbd5e1', fontSize: 11, marginVertical: 30 }
});