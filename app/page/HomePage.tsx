import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GestureResponderEvent } from "react-native";

import { Ionicons } from "@expo/vector-icons"; // Pour les icônes

interface Prelevement {
  id: number;
  nom: string;
  prix: number;
  datePrelevement: string;
}

const ITEMS_PER_PAGE = 5;
const SWIPE_THRESHOLD = 50;

const HomePage = () => {
    const { logout } = useContext(AuthContext);
  // ============ ÉTATS ============
  // Totaux et listes de prélèvements
  const [totalMontant, setTotalMontant] = useState<number>(0);
  const [totalPrelevements, setTotalPrelevements] = useState<number>(0);
  const [prelevementsAvenir, setPrelevementsAvenir] = useState<Prelevement[]>(
    []
  );
  const [prelevementsParMois, setPrelevementsParMois] = useState<Prelevement[]>(
    []
  );

  // Gestion des erreurs
  const [error, setError] = useState<string | null>(null);

  // Pagination et swipe
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [swipeStates, setSwipeStates] = useState<Record<number, number>>({});

  // Gestion des modales
  const [itemToDelete, setItemToDelete] = useState<Prelevement | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [itemToModifie, setItemToModifie] = useState<Prelevement | null>(null);
  const [showModifieModal, setShowModifieModal] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState<boolean>(false);

  // Réfs pour le swipe gesture
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  // ============ EFFECTS ============
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Utilisateur non connecté");

        const headers = {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        };

        const [totalMontantRes, totalPrelevementsRes, avenirRes, parMoisRes] =
          await Promise.all([
            axios.get("http://192.168.1.22:8080/prelevement/total", {
              headers,
            }),
            axios.get("http://192.168.1.22:8080/prelevement/totalprelev", {
              headers,
            }),
            axios.get("http://192.168.1.22:8080/prelevement/avenir", {
              headers,
            }),
            axios.get("http://192.168.1.22:8080/prelevement/par-mois", {
              headers,
            }),
          ]);

        setTotalMontant(totalMontantRes.data);
        setTotalPrelevements(totalPrelevementsRes.data);
        setPrelevementsAvenir(avenirRes.data);
        setPrelevementsParMois(parMoisRes.data);
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger les données.");
      }
    };

    fetchDashboardData();
  }, []);

  // ============ GESTION DU SWIPE ============

  // Fonction déclenchée au début du touch
  const handleTouchStart = (e: GestureResponderEvent) => {
    touchStartX.current = e.nativeEvent.pageX;
  };

  // Fonction déclenchée lors du déplacement du touch
  const handleTouchMove = (e: GestureResponderEvent, index: number) => {
    if (touchStartX.current === null) return;

    touchCurrentX.current = e.nativeEvent.pageX;
    const deltaX = touchCurrentX.current - touchStartX.current;

    if (deltaX < 0) {
      setSwipeStates((prev) => ({
        ...prev,
        [index]: Math.max(deltaX, -120), // limite à -120
      }));
    }
  };

  // Fonction déclenchée à la fin du touch
  const handleTouchEnd = (index: number) => {
    if (touchStartX.current === null || touchCurrentX.current === null) return;

    const deltaX = touchCurrentX.current - touchStartX.current;

    if (deltaX < -50) {
      // seuil pour rester ouvert
      setSwipeStates((prev) => ({ ...prev, [index]: -120 }));
    } else {
      setSwipeStates((prev) => ({ ...prev, [index]: 0 }));
    }

    // Reset
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  // ============ ACTIONS ============
  const handleModifier = async () => {
    if (!itemToModifie) return;
    setIsModifying(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non connecté");
      const headers = { Authorization: `Bearer ${token}` };

      const data = {
        nom: itemToModifie.nom,
        prix: Number(itemToModifie.prix),
        datePrelevement: itemToModifie.datePrelevement,
      };

      await axios.put(
        `http://192.168.1.22:8080/prelevement/modifier/${itemToModifie.id}`,
        data,
        { headers }
      );

      setPrelevementsParMois((prev) =>
        prev.map((p) =>
          p.id === itemToModifie.id
            ? {
                ...p,
                nom: data.nom,
                prix: data.prix,
                datePrelevement: data.datePrelevement,
              }
            : p
        )
      );

      setSwipeStates({});
      setShowModifieModal(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error(err);
      setError(
        `Échec de la modification: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setIsModifying(false);
      setItemToModifie(null);
    }
  };

  const handleSupprimer = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non connecté");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(
        `http://192.168.1.22:8080/prelevement/supprimer/${itemToDelete.id}`,
        { headers }
      );

      setPrelevementsParMois((prev) =>
        prev.filter((p) => p.id !== itemToDelete.id)
      );
      setSwipeStates({});
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError("Échec de la suppression.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(prelevementsParMois.length / ITEMS_PER_PAGE);
  const currentItems = prelevementsParMois
    .slice()
    .sort(
      (a, b) =>
        new Date(a.datePrelevement).getTime() -
        new Date(b.datePrelevement).getTime()
    )
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ============ RENDU ============
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tableau de bord</Text>
        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.totalsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              Nombre total de prélèvements ce mois-ci
            </Text>
            <Text style={styles.cardValue}>{totalPrelevements}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Montant total ce mois</Text>
            <Text style={styles.cardValue}>{totalMontant.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Prélèvements à venir */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prélèvements à venir</Text>
          {prelevementsAvenir.length === 0 ? (
            <Text style={styles.emptyText}>Aucun prélèvement à venir</Text>
          ) : (
            prelevementsAvenir.map((item, index) => {
              const date = new Date(item.datePrelevement);
              const day = date.getDate().toString().padStart(2, "0");
              const monthName = date.toLocaleDateString("fr-FR", {
                month: "long",
              });
              return (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Image
                      source={{ uri: `/logos/${item.nom.toLowerCase()}.png` }}
                      style={styles.logo}
                    />
                    <Text style={styles.itemText}>
                      {day} {monthName}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>{item.prix.toFixed(2)} €</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Prélèvements par mois */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prélèvements par mois</Text>
          {currentItems.map((item, index) => {
            const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
            const translateX = swipeStates[globalIndex] || 0;
            let date: Date;
            if (item.datePrelevement.includes("-")) {
              const [yearStr, monthStr, dayStr] =
                item.datePrelevement.split("-");
              const year = parseInt(yearStr, 10);
              const month = parseInt(monthStr, 10) - 1; // mois commence à 0
              const day = parseInt(dayStr, 10);
              date = new Date(year, month, day);
            } else {
              date = new Date(item.datePrelevement);
            }

            const formattedDate = date.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
            });

            return (
              <View key={globalIndex} style={styles.swipeItem}>
                {/* Actions fixes derrière */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => {
                      setItemToModifie(item);
                      setShowModifieModal(true);
                    }}
                    style={[
                      styles.actionButton,
                      { backgroundColor: "#3B82F6" },
                    ]}
                  >
                    <Ionicons name="pencil" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setItemToDelete(item);
                      setShowDeleteModal(true);
                    }}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: "#DC2626",
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                      },
                    ]}
                  >
                    <Ionicons name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Item qui se déplace */}
                <View
                  style={[styles.itemRow, { transform: [{ translateX }] }]}
                  onTouchStart={handleTouchStart}
                  onTouchMove={(e) => handleTouchMove(e, globalIndex)}
                  onTouchEnd={() => handleTouchEnd(globalIndex)}
                >
                  <View style={styles.itemLeft}>
                    <Image
                      source={{ uri: `/logos/${item.nom.toLowerCase()}.png` }}
                      style={styles.logo}
                    />
            <Text style={styles.itemText}>
  {formattedDate}
</Text>

                  </View>
                  <Text style={styles.itemPrice}>{item.prix.toFixed(2)} €</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Pagination */}
        {totalPages > 1 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 16,
            }}
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setCurrentPage(i + 1)}
                style={{ marginHorizontal: 8 }}
              >
                <Text
                  style={{
                    color: i + 1 === currentPage ? "#0aae49ff" : "#6B7280",
                  }}
                >
                  {i + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Modales */}
        <Modal visible={showDeleteModal} transparent animationType="fade">
          <View style={modalStyles.overlay}>
            <View style={modalStyles.modal}>
              <Text>Supprimer ce prélèvement ?</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                  <Text>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSupprimer}
                  disabled={isDeleting}
                >
                  <Text style={{ color: "#DC2626" }}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showModifieModal} transparent animationType="fade">
          <View style={modalStyles.overlay}>
            <View style={modalStyles.modal}>
              <Text>Modifier le prélèvement</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  marginVertical: 8,
                }}
                value={itemToModifie?.prix?.toString() || ""}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setItemToModifie((prev) =>
                    prev ? { ...prev, prix: Number(text) } : null
                  )
                }
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <TouchableOpacity onPress={() => setShowModifieModal(false)}>
                  <Text>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleModifier}
                  disabled={isModifying}
                >
                  <Text style={{ color: "#3B82F6" }}>Modifier</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showSuccessModal} transparent animationType="fade">
          <View style={modalStyles.overlay}>
            <View style={modalStyles.modal}>
              <Text>Opération réussie !</Text>
              <TouchableOpacity
                onPress={() => setShowSuccessModal(false)}
                style={{ marginTop: 16 }}
              >
                <Text style={{ color: "#0aae49ff" }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  title: {
    fontSize: 24,
    fontWeight: "bold",

    marginBottom: 16,
    color: "#111827",
  },
  error: { color: "#DC2626", fontWeight: "bold", marginBottom: 8 },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLabel: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  cardValue: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },
  emptyText: { color: "#6B7280" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemText: { color: "#374151" },
  itemPrice: { fontWeight: "bold", color: "#111827" },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  swipeItem: {
    position: "relative",
    overflow: "hidden", // pour que le contenu ne dépasse pas
  },

  actions: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 120,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: { padding: 20 },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    minWidth: 280,
  },
});

export default HomePage;
