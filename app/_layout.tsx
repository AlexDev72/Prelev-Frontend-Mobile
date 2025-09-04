import { Stack } from "expo-router";
import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import NavBottom from "./navigation/NavBottom"; // ton Bottom Tab Navigator

function RootStack() {
  const { token, loading, logout } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return token ? (
    // Si connecté, on affiche NavBottom (toutes les pages derrière les tabs)
    <NavBottom onLogout={logout} />
  ) : (
    // Si pas connecté, on affiche stack login/register
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthStack/Login" />
      <Stack.Screen name="AuthStack/Register" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootStack />
    </AuthProvider>
  );
}
