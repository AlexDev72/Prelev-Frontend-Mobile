import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

// J'importe les types pour navigation stack
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";

// Je définis les props de LoginScreen : navigation & route sont déjà fournies par React Navigation, 
// on ajoute seulement onLogin
type Props = NativeStackScreenProps<AuthStackParamList, "Login"> & {
  onLogin: () => void;
};

// Composant LoginScreen
const LoginScreen = ({ navigation, onLogin }: Props) => {
  // États pour stocker l'email et le mot de passe
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // État pour gérer la visibilité du mot de passe
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Fonction pour basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  // Fonction pour gérer le login
  const handleLogin = async () => {
    try {
      // J'envoie les infos au backend
      const response = await axios.post("http://192.168.1.22:8080/auth/connexion", {
        email: Email,
        mdp: password,
      });

      console.log("Réponse backend :", response.data);

      // Si tout est ok, l'utilisateur est connecté
      onLogin();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Prelev'</Text>

      {/* Input Email */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={Email}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Ionicons name="mail-outline" size={24} color="grey" style={styles.emailIcon} />
      </View>

      {/* Input Password */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
        />
        {/* Bouton pour afficher/cacher le mot de passe */}
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={24} color="grey" />
        </TouchableOpacity>
      </View>

      {/* Bouton de connexion */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      {/* Lien mot de passe oublié */}
      <Text style={styles.forgotPassword}>J'ai oublié mon mot de passe</Text>

      {/* Lien pour s'inscrire */}
      <View style={styles.signupContainer}>
        <Text>Je ne suis pas inscrit ?</Text>
        {/* Ici on navigue vers RegisterScreen */}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: wp("4%"), backgroundColor: "#fff" },
  title: { fontSize: wp("6%"), marginBottom: hp("3%"), fontWeight: "bold" },
  inputContainer: { flexDirection: "row", alignItems: "center", width: "100%" },
  input: { flex: 1, height: 50, marginVertical: 10, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#ddd" },
  eyeIcon: { position: "absolute", right: wp("2.5%"), padding: wp("2.5%") },
  emailIcon: { position: "absolute", right: wp("2.5%"), padding: wp("2.5%") },
  button: { backgroundColor: "#2c9d46ff", borderRadius: 25, padding: wp("3%"), alignItems: "center", marginTop: hp("2.5%"), width: "100%" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: wp("4%") },
  forgotPassword: { color: "#0aae49ff", marginTop: hp("2.5%"), fontSize: wp("3.5%") },
  signupContainer: { flexDirection: "row", marginTop: hp("2.5%") },
  signupText: { color: "#0aae49ff", marginLeft: wp("1%"), fontSize: wp("3.5%") },
});

export default LoginScreen;
