import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  StatusBar,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Ajout crucial
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLLEGUES = [
  { id: 'c1', nom: 'Marc Zola', statut: 'En ligne', type: 'eleve' },
  { id: 'c2', nom: 'Sarah Kin', statut: 'Occupé', type: 'eleve' },
  { id: 'c3', nom: 'Arsène Lup', statut: 'À l\'école', type: 'eleve' },
  { id: 'c4', nom: 'Princesse M.', statut: 'En ligne', type: 'eleve' },
];

const INITIAL_DATA = [
  { id: '1', nom: 'Groupe L2 - Génie Logiciel', dernierMsg: 'Le TP est à rendre lundi.', temps: '10:30', type: 'groupe', statut: 'non-lu', favori: true },
  { id: '2', nom: 'Prof. Mutombo (Maths)', dernierMsg: 'Vérifie la formule à la page 12.', temps: '09:15', type: 'prof', statut: 'lu', favori: true },
  { id: '3', nom: 'Naomie', dernierMsg: '📞 Appel vidéo manqué', temps: 'Hier', type: 'eleve', statut: 'lu', favori: false },
];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Gestion dynamique de l'espace haut
  const [activeTab, setActiveTab] = useState('Tous'); 
  const [chats, setChats] = useState(INITIAL_DATA);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const filteredChats = chats.filter(c => {
    if (activeTab === 'Tous') return true;
    if (activeTab === 'Groupes') return c.type === 'groupe';
    if (activeTab === 'Non lus') return c.statut === 'non-lu';
    if (activeTab === 'Favoris') return c.favori === true;
    return true;
  });

  const startNewChat = (collegue: any) => {
    setIsModalVisible(false);
    const exists = chats.find(c => c.nom === collegue.nom);
    if (!exists) {
      const newChat = {
        id: Math.random().toString(),
        nom: collegue.nom,
        dernierMsg: 'Nouvelle discussion...',
        temps: 'Maintenant',
        type: 'eleve',
        statut: 'lu',
        favori: false
      };
      setChats([newChat, ...chats]);
      router.push({ pathname: "/conversation/[id]", params: { id: newChat.id, nom: newChat.nom } });
    } else {
      router.push({ pathname: "/conversation/[id]", params: { id: exists.id, nom: exists.nom } });
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.chatCard} 
      activeOpacity={0.7}
      onPress={() => router.push({
        pathname: "/conversation/[id]",
        params: { id: item.id, nom: item.nom }
      })}
    >
      <View style={[styles.avatar, item.type === 'groupe' ? styles.avatar_groupe : item.type === 'prof' ? styles.avatar_prof : styles.avatar_eleve]}>
        <Ionicons 
          name={item.type === 'groupe' ? "people" : (item.type === 'prof' ? "school" : "person")} 
          size={26} 
          color={item.type === 'prof' ? "#1e3a8a" : "#475569"} 
        />
        {item.statut === 'non-lu' && <View style={styles.unreadDot} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, item.statut === 'non-lu' && { fontWeight: 'bold' }]} numberOfLines={1}>
            {item.nom}
          </Text>
          <Text style={[styles.chatTime, item.statut === 'non-lu' && { color: '#1e3a8a', fontWeight: 'bold' }]}>
            {item.temps}
          </Text>
        </View>
        <Text style={[styles.lastMsg, item.statut === 'non-lu' && { color: '#1e293b', fontWeight: '600' }]} numberOfLines={1}>
          {item.dernierMsg}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER AVEC TITRE ET RECHERCHE */}
      <View style={styles.topHeader}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.searchCircle}>
          <Ionicons name="search" size={22} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* FILTRES */}
      <View style={styles.navScrollWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navScrollContent}>
          {['Tous', 'Non lus', 'Groupes', 'Favoris'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)} 
              style={[styles.navTab, activeTab === tab && styles.navTabActive]}
            >
              <Text style={[styles.navTabText, activeTab === tab && styles.navTabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={80} color="#e2e8f0" />
            <Text style={styles.emptyText}>Aucune discussion trouvée</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* MODALE */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color="#1e293b" />
            </TouchableOpacity>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Nouveau message</Text>
              <Text style={styles.modalSubtitle}>{COLLEGUES.length} collègues en ligne</Text>
            </View>
          </View>
          
          <FlatList
            data={COLLEGUES}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.collegueCard} onPress={() => startNewChat(item)}>
                <View style={styles.collegueAvatar}>
                  <Text style={styles.collegueInitial}>{item.nom.charAt(0)}</Text>
                  <View style={styles.onlineBadge} />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.collegueName}>{item.nom}</Text>
                  <Text style={styles.collegueStatus}>{item.statut}</Text>
                </View>
                <Ionicons name="chatbubble-outline" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            )}
            ListHeaderComponent={<Text style={styles.listHeader}>Suggérés</Text>}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10,
    paddingBottom: 5
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1e293b' },
  searchCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },

  navScrollWrapper: { marginVertical: 10 },
  navScrollContent: { paddingHorizontal: 20 },
  navTab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, backgroundColor: '#f1f5f9', marginRight: 10 },
  navTabActive: { backgroundColor: '#1e3a8a' },
  navTabText: { fontSize: 14, color: '#64748b', fontWeight: 'bold' },
  navTabTextActive: { color: '#fff' },

  list: { paddingHorizontal: 20, paddingBottom: 100 },
  chatCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  avatar: { width: 60, height: 60, borderRadius: 22, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  avatar_groupe: { backgroundColor: '#e0e7ff' },
  avatar_prof: { backgroundColor: '#dcfce7' },
  avatar_eleve: { backgroundColor: '#f1f5f9' },
  unreadDot: { position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#3b82f6', borderWidth: 3, borderColor: '#fff' },

  chatInfo: { flex: 1, marginLeft: 15 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 17, color: '#1e293b', fontWeight: '600' },
  chatTime: { fontSize: 12, color: '#94a3b8' },
  lastMsg: { fontSize: 14, color: '#94a3b8' },
  
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { textAlign: 'center', marginTop: 15, color: '#94a3b8', fontSize: 16 },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#1e3a8a',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9' 
  },
  closeBtn: { padding: 5 },
  modalTitleContainer: { marginLeft: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  modalSubtitle: { fontSize: 13, color: '#94a3b8' },
  
  listHeader: { padding: 20, fontSize: 12, color: '#1e3a8a', fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  collegueCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  collegueAvatar: { width: 50, height: 50, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 15, position: 'relative' },
  collegueInitial: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  onlineBadge: { position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10b981', borderWidth: 2, borderColor: '#fff' },
  collegueName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  collegueStatus: { fontSize: 12, color: '#64748b' }
});