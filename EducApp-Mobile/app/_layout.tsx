import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * RootLayout - Version Mise à jour 2026
 * Structure globale de l'application EducApp incluant Videocours
 */
export default function RootLayout() {
  return (
    <>
      {/* Barre d'état sombre pour contraster avec le fond clair #f8fafc */}
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          // On désactive le header par défaut d'Expo pour utiliser nos designs personnalisés
          headerShown: false, 
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        {/* 1. ÉCRAN D'ACCUEIL / SÉLECTEUR DE RÔLE (Fichier app/index.tsx) */}
        <Stack.Screen 
          name="index" 
          options={{
            animation: 'fade', 
          }}
        />

        {/* 2. ÉCRAN DE CONNEXION ÉLÈVE */}
        <Stack.Screen 
          name="login-eleve" 
          options={{ 
            presentation: 'modal', 
            animation: 'slide_from_bottom',
            gestureEnabled: true 
          }} 
        />

        {/* 3. L'INTERFACE PRINCIPALE (Dossier app/(tabs)/_layout.tsx)
            Contient désormais : Accueil, Biblio, Videocours, Chat, Notifications. */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            animation: 'fade_from_bottom', 
          }} 
        />

        {/* 4. MESSAGERIE / CONVERSATION */}
        <Stack.Screen 
          name="conversation/[id]" 
          options={{ 
            animation: 'slide_from_right',
            presentation: 'card', 
          }} 
        />

        {/* 5. ÉCRAN VIDÉO PLEIN ÉCRAN (Optionnel)
            Si tu décides de sortir Videocours des onglets pour un mode plein écran total */}
        <Stack.Screen 
          name="videocours" 
          options={{ 
            animation: 'fade',
            orientation: 'portrait',
          }} 
        />

        {/* 6. ESPACE ADMINISTRATION */}
        <Stack.Screen 
          name="admin" 
          options={{ 
            animation: 'simple_push' 
          }} 
        />
      </Stack>
    </>
  );
}