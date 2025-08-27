import React, { useState } from "react";

// J'importe la barre de navigation bottom pour l'app principale
import NavBottom from "./navigation/NavBottom";

// J'importe le stack d'authentification
import AuthStack from "./navigation/AuthStack";

const App = () => {
  // État pour savoir si l'utilisateur est connecté
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fonction appelée après login
  const handleLogin = () => setIsLoggedIn(true);

  // Fonction appelée pour déconnexion
  const handleLogout = () => setIsLoggedIn(false);

  // Pas de NavigationContainer ici, c'est déjà fourni par le layout
  return isLoggedIn ? (
    // Si connecté, on affiche la barre de navigation bottom
    <NavBottom onLogout={handleLogout} />
  ) : (
    // Sinon, on affiche le stack d'auth (Login / Register)
    <AuthStack onLogin={handleLogin} />
  );
};

export default App;
