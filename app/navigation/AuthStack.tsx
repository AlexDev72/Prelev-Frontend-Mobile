import React from "react";

// J'importe createNativeStackNavigator pour créer un stack de navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// J'importe mes écrans Login et Register
import LoginScreen from "../page/LoginPage";
import RegisterScreen from "../page/RegisterPage";

// Type du stack Auth : Login et Register n'ont pas de params
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Création du stack
const Stack = createNativeStackNavigator<AuthStackParamList>();

// Composant stack pour l'authentification
const AuthStack = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Page de connexion */}
      <Stack.Screen name="Login">
        {/* On passe la fonction onLogin et React Navigation fournit navigation et route */}
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>

      {/* Page d'inscription */}
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
