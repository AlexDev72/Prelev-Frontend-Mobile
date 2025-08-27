import React, { useState } from "react";
import axios from "axios";
// J'importe tous les composants nécessaires de React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// J'importe des fonctions pour gérer les dimensions responsives de l'écran
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// J'importe les types pour navigation stack
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";

// Je définis les props du composant RegisterScreen
interface RegisterScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
}

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  // États pour stocker l'email et le mot de passe
  const [email, setEmail] = useState("");
  const [mdp, setPassword] = useState("");

  // État pour gérer la visibilité du mot de passe
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Fonction pour basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  // Fonction pour gérer l'inscription
  // État pour le message de réussite
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    try {
        console.log("Envoi inscription :", { email, mdp });

      const response = await axios.post(
        "http://192.168.1.22:8080/utilisateur/cree",
        { email, mdp: mdp },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Réponse backend :", response.data);

        navigation.navigate("Login");
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      {/* Input Email */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Input Password */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={mdp}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
        />
        {/* Bouton pour afficher/cacher le mot de passe */}
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={passwordVisible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="grey"
          />
        </TouchableOpacity>
      </View>

      {/* Bouton d'inscription */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      {/* Lien vers Login si déjà inscrit */}
      <View style={styles.loginContainer}>
        <Text>Déjà inscrit ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("4%"),
    backgroundColor: "#fff",
  },
  title: { fontSize: wp("6%"), fontWeight: "bold", marginBottom: hp("3%") },
  inputContainer: { flexDirection: "row", alignItems: "center", width: "100%" },
  input: {
    flex: 1,
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#2c9d46",
    borderRadius: 25,
    padding: wp("3%"),
    alignItems: "center",
    marginTop: hp("2.5%"),
    width: "100%",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: wp("4%") },
  loginContainer: { flexDirection: "row", marginTop: hp("2.5%") },
  loginText: { color: "#0aae49ff", marginLeft: wp("1%"), fontSize: wp("3.5%") },
  eyeIcon: { position: "absolute", right: wp("2.5%"), padding: wp("2.5%") },
});

export default RegisterScreen;
