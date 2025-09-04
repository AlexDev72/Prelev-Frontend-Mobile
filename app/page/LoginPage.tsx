import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthContext } from "../../context/AuthContext";
import { AuthStackParamList } from "../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen = ({ navigation }: Props) => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useContext(AuthContext); // connexion via contexte

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.22:8080/auth/connexion", {
        email: Email,
        mdp: password,
      });

      const token = response.data.token;
      await login(token); // stocke token et met à jour contexte
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Prelev'</Text>

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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={24} color="grey" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>J'ai oublié mon mot de passe</Text>

      <View style={styles.signupContainer}>
        <Text>Je ne suis pas inscrit ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
