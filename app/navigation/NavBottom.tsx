import React from "react";

// J'importe le bottom tab navigator de React Navigation pour créer la barre de navigation en bas
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// J'importe l'écran HomePage qui sera un onglet dans la barre
import HomePage from "../page/HomePage";

// J'importe les icônes Ionicons pour mettre des icônes sur les onglets
import { Ionicons } from "@expo/vector-icons";

// Je crée une instance du bottom tab navigator
const Tab = createBottomTabNavigator();

// Je définis le type des props que mon composant NavBottom reçoit
// Ici, je reçois une fonction onLogout depuis index.tsx pour gérer la déconnexion
interface NavBottomProps {
  onLogout: () => void;
}

// Je crée un composant vide pour éviter le warning lié à component={() => null}
const EmptyScreen = () => null;

// Je définis mon composant de navigation bottom
const NavBottom = ({ onLogout }: NavBottomProps) => {
  return (
    // Mon Tab.Navigator contient tous mes onglets
    <Tab.Navigator
      // screenOptions me permet de configurer les options de tous les onglets
      screenOptions={({ route }) => ({
        // Je ne veux pas d'en-tête en haut de chaque écran
        headerShown: false,

        // Je définis les icônes pour chaque onglet
        tabBarIcon: ({ color, size }) => {
          // Je choisis l'icône par défaut
          let iconName = "home-outline" as keyof typeof Ionicons.glyphMap;

          // Si l'onglet est Home, je mets l'icône maison
          if (route.name === "Home") iconName = "home-outline";

          // Si l'onglet est Logout, je mets l'icône de déconnexion
          if (route.name === "Logout") iconName = "log-out-outline";

          // Je retourne l'icône avec la couleur et la taille fournies par React Navigation
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // Couleur de l'icône quand l'onglet est actif
        tabBarActiveTintColor: "#2c9d46",
        // Couleur de l'icône quand l'onglet est inactif
        tabBarInactiveTintColor: "gray",
      })}
    >
      {/* Je définis mon onglet Home avec HomePage comme écran */}
      <Tab.Screen name="Home" component={HomePage} />

      {/* Je définis un onglet Logout qui n'affiche pas d'écran mais exécute la déconnexion */}
      <Tab.Screen
        name="Logout"
        component={EmptyScreen} // j'utilise un composant vide pour éviter le warning
        listeners={{
          // Quand on appuie sur l'onglet Logout
          tabPress: (e) => {
            e.preventDefault(); // j'empêche la navigation vers un écran vide
            onLogout(); // j'appelle la fonction de déconnexion passée par index.tsx
          },
        }}
        options={{
          tabBarLabel: "Déconnexion", // le texte affiché dans l'onglet
        }}
      />
    </Tab.Navigator>
  );
};

export default NavBottom;
