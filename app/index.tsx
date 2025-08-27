// app/index.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "./login";

export default function Index() {
  // Remplace par ton vrai check si nécessaire
  const isLoggedIn = false;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoggedIn ? (
        // Ici tu pourrais mettre ton composant HomeScreen
        <SafeAreaView>
          <Text>Page Home</Text>
        </SafeAreaView>
      ) : (
        <LoginScreen />
      )}
    </SafeAreaView>
  );
}
