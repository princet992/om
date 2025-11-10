import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import aarti from "../../data/Aarti";
import chalisa from "../../data/chalisa";
import strotam from "../../data/strotam";

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ key: string; count: number }[]>([]);

  useEffect(() => {
    const data = [...chalisa, ...strotam, ...aarti];
    const map: Record<string, number> = {};
    data.forEach((item: any) => {
      const key = item.category || "Uncategorized";
      map[key] = (map[key] || 0) + 1;
    });
    setCategories(Object.keys(map).map((k) => ({ key: k, count: map[k] })));
  }, []);

  const accent = useThemeColor({}, "accent");
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const gradients = [
    ["#FF5F6D", "#FFC371"],
    ["#FF9966", "#FF5E62"],
    ["#00C9FF", "#92FE9D"],
    ["#f857a6", "#ff5858"],
    ["#FFB75E", "#ED8F03"],
    ["#7F00FF", "#E100FF"],
  ];

  const icons = [
    "flame-outline",
    "infinite-outline",
    "leaf-outline",
    "sunny-outline",
    "moon-outline",
    "star-outline",
    "heart-outline",
  ];

  return (
    <LinearGradient colors={[background, "#fff"]} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={[styles.header, { color: textColor }]}>🕉 आरती, चालीसा और स्तोत्र संग्रह 🕉</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {categories.map((cat, idx) => (
              <TouchableOpacity
                key={cat.key}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: "/screens/details",
                    params: { category: cat.key },
                  })
                }
                style={styles.cardContainer}
              >
                <LinearGradient
                  colors={gradients[idx % gradients.length] as [string, string]}
                  style={styles.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={icons[idx % icons.length] as any} size={28} color="#fff" style={styles.cardIcon} />
                  <Text style={styles.title}>{cat.key}</Text>
                  <Text style={styles.subtitle}>{cat.count} Verses</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 26,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardContainer: {
    width: "47%",
    marginBottom: 18,
  },
  card: {
    borderRadius: 18,
    paddingVertical: 26,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardIcon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
});
