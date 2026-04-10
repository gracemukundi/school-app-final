import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Types de messages enrichis
interface Message {
  id: string;
  text?: string;
  sender: 'me' | 'them';
  time: string;
  type: 'text' | 'call';
  callType?: 'audio' | 'video';
  callStatus?: 'missed' | 'completed';
}

export default function ConversationScreen() {
  // Correction 1: Assurer que nom est une string pour éviter les erreurs de rendu
  const params = useLocalSearchParams();
  const id = params.id as string;
  const nom = (params.nom as string) || "Utilisateur";
  
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Salut ! Tu as pu avancer sur le projet ?', sender: 'them', time: '10:00', type: 'text' },
    { id: '2', text: 'Oui, je suis en train de coder la partie chat.', sender: 'me', time: '10:05', type: 'text' },
    { id: '3', sender: 'them', time: '10:10', type: 'call', callType: 'video', callStatus: 'missed' },
  ]);

  const flatListRef = useRef<FlatList>(null);

  const startCall = (isVideo: boolean) => {
    console.log(`Lancement de l'appel ${isVideo ? 'Vidéo' : 'Audio'}`);
    router.push({
      pathname: '/call-screen' as any, // Correction: Utilisation de 'as any' pour éviter les erreurs de route strictes
      params: { isVideo: isVideo ? 'true' : 'false', nom: nom }
    });
  };

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    
    // Correction 2: Utilisation d'un ID plus robuste
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputText.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Scroller après un court délai pour laisser le layout se mettre à jour
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderCallMessage = (item: Message) => (
    <View style={styles.callMessageContainer}>
      <View style={[styles.callIconBox, { backgroundColor: item.callStatus === 'missed' ? '#fee2e2' : '#f1f5f9' }]}>
        <Ionicons 
          name={item.callType === 'video' ? "videocam" : "call"} 
          size={20} 
          color={item.callStatus === 'missed' ? "#ef4444" : "#1e3a8a"} 
        />
      </View>
      <View style={styles.callDetails}>
        <Text style={styles.callTitle}>
          {item.callType === 'video' ? 'Appel vidéo' : 'Appel audio'} {item.callStatus === 'missed' ? 'manqué' : 'terminé'}
        </Text>
        <Text style={styles.callTime}>{item.time}</Text>
      </View>
      {item.callStatus === 'missed' && (
        <TouchableOpacity style={styles.retryBtn} onPress={() => startCall(item.callType === 'video')}>
          <Text style={styles.retryText}>Rappeler</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageWrapper, 
      item.sender === 'me' ? styles.myMessageWrapper : styles.theirMessageWrapper
    ]}>
      {item.type === 'call' ? (
        renderCallMessage(item)
      ) : (
        <View style={[
          styles.bubble, 
          item.sender === 'me' ? styles.myBubble : styles.theirBubble
        ]}>
          <Text style={[styles.messageText, item.sender === 'me' && { color: '#fff' }]}>
            {item.text}
          </Text>
          <View style={styles.timeWrapper}>
            <Text style={[styles.messageTime, item.sender === 'me' && { color: '#e0e7ff' }]}>
              {item.time}
            </Text>
            {item.sender === 'me' && (
              <Ionicons name="checkmark-done" size={14} color="#e0e7ff" style={{marginLeft: 3}} />
            )}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#1e3a8a" />
        </TouchableOpacity>
        
        <View style={styles.avatarMini}>
          <Text style={styles.avatarInitial}>{nom.substring(0, 1).toUpperCase()}</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{nom}</Text>
          <Text style={styles.headerStatus}>En ligne</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => startCall(false)}>
            <Ionicons name="call-outline" size={24} color="#1e3a8a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => startCall(true)}>
            <Ionicons name="videocam-outline" size={26} color="#1e3a8a" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputArea}>
          <View style={styles.inputMainContainer}>
            <TouchableOpacity style={styles.inputIcon}>
              <Ionicons name="happy-outline" size={24} color="#64748b" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="Message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            
            <TouchableOpacity style={styles.inputIcon}>
              <Ionicons name="attach" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && { backgroundColor: '#94a3b8' }]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name={inputText.trim() ? "send" : "mic"} size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e2e8f0',
    elevation: 2 
  },
  backBtn: { padding: 5 },
  avatarMini: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1e3a8a', justifyContent: 'center', alignItems: 'center', marginLeft: 5 },
  avatarInitial: { color: '#fff', fontWeight: 'bold' },
  headerInfo: { flex: 1, marginLeft: 10 },
  headerName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  headerStatus: { fontSize: 11, color: '#10b981', fontWeight: '600' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { padding: 8, marginLeft: 5 },
  messageList: { paddingHorizontal: 15, paddingVertical: 20 },
  messageWrapper: { marginBottom: 15, flexDirection: 'row' },
  myMessageWrapper: { justifyContent: 'flex-end' },
  theirMessageWrapper: { justifyContent: 'flex-start' },
  bubble: { padding: 12, borderRadius: 20, maxWidth: '80%', elevation: 1 },
  myBubble: { backgroundColor: '#1e3a8a', borderBottomRightRadius: 2 },
  theirBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2 },
  messageText: { fontSize: 15, color: '#1e293b', lineHeight: 20 },
  timeWrapper: { flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', marginTop: 4 },
  messageTime: { fontSize: 10, color: '#94a3b8' },
  callMessageContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 15, 
    width: '80%',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  callIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  callDetails: { flex: 1, marginLeft: 12 },
  callTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  callTime: { fontSize: 11, color: '#94a3b8' },
  retryBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#1e3a8a10' },
  retryText: { color: '#1e3a8a', fontSize: 12, fontWeight: 'bold' },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', padding: 10 },
  inputMainContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 10, minHeight: 45, elevation: 2 },
  inputIcon: { padding: 8 },
  input: { flex: 1, paddingVertical: 8, paddingHorizontal: 5, fontSize: 16, maxHeight: 100 },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1e3a8a', justifyContent: 'center', alignItems: 'center', marginLeft: 8, elevation: 3 }
});