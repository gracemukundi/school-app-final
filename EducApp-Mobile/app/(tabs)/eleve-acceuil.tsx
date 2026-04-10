import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EleveAcceuil() {
  const router = useRouter();

  // Navigation vers la page de menu complète (au lieu d'une simple Alert)
  const openMenu = () => {
    router.push('/menu-settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre d'état configurée pour le thème clair */}
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER : MENU BURGER À GAUCHE ET AVATAR À DROITE */}
      <View style={styles.topNavigation}>
        <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
          <Ionicons name="menu-outline" size={32} color="#1e3a8a" />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.avatar}
            onPress={() => router.push('/menu-settings')} // Permet aussi d'ouvrir le menu via l'avatar
          >
            <Text style={styles.avatarText}>GM</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        
        {/* SALUTATIONS */}
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeText}>Bonjour,</Text>
          <Text style={styles.studentName}>Grace Mutombo 👋</Text>
          <Text style={styles.schoolTag}>Complexe Scolaire EducApp</Text>
        </View>

        {/* SCORE DE MÉRITE */}
        <View style={styles.meritCard}>
          <View style={styles.meritContent}>
            <Text style={styles.meritTitle}>Points de mérite</Text>
            <View style={styles.meritRow}>
              <Text style={styles.meritValue}>+125</Text>
              <Ionicons name="star" size={32} color="#fbbf24" />
            </View>
            <Text style={styles.meritSub}>Tu es dans le top 5 de ta classe !</Text>
          </View>
          <View style={styles.meritBadge}>
            <Ionicons name="trophy" size={50} color="rgba(255,255,255,0.2)" />
          </View>
        </View>

        {/* MES TÂCHES (DEVOIRS ET QUIZ) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes Tâches</Text>
          <View style={styles.tasksRow}>
            {/* BOUTON DEVOIRS */}
            <TouchableOpacity 
              style={[styles.taskCard, { backgroundColor: '#FFF4E5' }]}
              onPress={() => router.push('/(tabs)/devoirs')}
            >
              <View style={[styles.taskIconBox, { backgroundColor: '#FFA00020' }]}>
                <Ionicons name="copy" size={28} color="#FFA000" />
              </View>
              <Text style={styles.taskLabel}>Devoirs</Text>
              <Text style={styles.taskCount}>3 en attente</Text>
            </TouchableOpacity>

            {/* BOUTON QUIZ */}
            <TouchableOpacity 
              style={[styles.taskCard, { backgroundColor: '#F3E8FF' }]}
              onPress={() => router.push('/(tabs)/quiz')}
            >
              <View style={[styles.taskIconBox, { backgroundColor: '#7C3AED20' }]}>
                <Ionicons name="extension-puzzle" size={28} color="#7C3AED" />
              </View>
              <Text style={styles.taskLabel}>Quiz</Text>
              <Text style={styles.taskCount}>1 nouveau</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DERNIÈRE LEÇON VISIONNÉE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dernière leçon</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/library')}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity activeOpacity={0.9} style={styles.lessonCard}>
            <View style={styles.lessonThumbnail}>
              <Ionicons name="play" size={30} color="white" />
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonCategory}>MATHÉMATIQUES</Text>
              <Text style={styles.lessonTitle}>Les fractions (Partie 2)</Text>
              <Text style={styles.lessonTeacher}>Mme. Naomie</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Espace de sécurité pour le scroll final au-dessus de la TabBar */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd' },
  scrollContent: { flex: 1 },
  
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  menuButton: { padding: 5 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: '#1e3a8a', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 3
  },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

  welcomeHeader: { paddingHorizontal: 25, marginTop: 10, marginBottom: 20 },
  welcomeText: { fontSize: 14, color: '#94a3b8' },
  studentName: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  schoolTag: { fontSize: 12, color: '#3b82f6', fontWeight: '600', marginTop: 2 },
  
  meritCard: { 
    marginHorizontal: 25, 
    padding: 20, 
    backgroundColor: '#1e3a8a', 
    borderRadius: 25, 
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  meritContent: { flex: 1 },
  meritTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold' },
  meritRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  meritValue: { color: 'white', fontSize: 36, fontWeight: '900', marginRight: 8 },
  meritSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  meritBadge: { position: 'absolute', right: 10 },

  section: { paddingHorizontal: 25, marginTop: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  viewAll: { color: '#3b82f6', fontWeight: 'bold' },

  tasksRow: { flexDirection: 'row', justifyContent: 'space-between' },
  taskCard: { 
    flex: 0.48, 
    padding: 20, 
    borderRadius: 25, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  taskIconBox: { 
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  taskLabel: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  taskCount: { fontSize: 12, color: '#64748b', marginTop: 4 },

  lessonCard: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    elevation: 2, 
    borderWidth: 1, 
    borderColor: '#f1f5f9' 
  },
  lessonThumbnail: { 
    width: 70, 
    height: 70, 
    backgroundColor: '#334155', 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  lessonInfo: { marginLeft: 15, flex: 1 },
  lessonCategory: { fontSize: 10, color: '#3b82f6', fontWeight: 'bold' },
  lessonTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  lessonTeacher: { fontSize: 12, color: '#94a3b8' },
});