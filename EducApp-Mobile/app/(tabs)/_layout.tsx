import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1e3a8a', // Bleu EducApp
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          elevation: 8, // Ombre sur Android
          shadowColor: '#000', // Ombre sur iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        headerShown: false, // On utilise nos propres headers dans les pages
      }}
    >
      {/* 1. ACCUEIL */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. ÉCOLES */}
      <Tabs.Screen
        name="schools-tab"
        options={{
          title: 'Écoles',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3. LICENCES */}
      <Tabs.Screen
        name="licences"
        options={{
          title: 'Licences',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'key' : 'key-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 4. BIBLIOTHÈQUE */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'library' : 'library-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}