import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1e3a8a', // Bleu EducApp
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          elevation: 20, // Ombre forte pour bien séparer la barre
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 15,
        },
      }}
    >
      {/* 1. ACCUEIL */}
      <Tabs.Screen
        name="eleve-acceuil"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. COURS */}
      <Tabs.Screen
        name="cours"
        options={{
          title: 'Cours',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3. BIBLIO (Library) */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Biblio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'library' : 'library-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 4. CHAT */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* --- PAGES MASQUÉES DE LA BARRE DU BAS --- */}
      {/* On garde name="devoirs" pour que la route existe, 
          mais href: null le cache de la navigation visuelle */}
      
      <Tabs.Screen
        name="devoirs"
        options={{
          href: null, // Cache l'onglet
        }}
      />

      <Tabs.Screen
        name="quiz"
        options={{
          href: null, // Cache l'onglet
        }}
      />
    </Tabs>
  );
}