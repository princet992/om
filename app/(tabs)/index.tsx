import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Import directly since your files export default arrays
import aarti from "../../data/Aarti";
import chalisa from "../../data/chalisa";
import strotam from "../../data/strotam";

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { key: string; count: number }[]
  >([]);

  useEffect(() => {
    // ✅ Combine all static data arrays
    const data = [...chalisa, ...strotam, ...aarti];

    // ✅ Map categories and count how many items each has
    const map: Record<string, number> = {};
    data.forEach((item: any) => {
      const key = item.category || "Uncategorized";
      map[key] = (map[key] || 0) + 1;
    });

    // ✅ Convert to array for rendering
    const arr = Object.keys(map).map((k) => ({ key: k, count: map[k] }));
    setCategories(arr);
  }, []);

  const accent = useThemeColor({}, "accent");
  const card = useThemeColor({}, "card");
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const colors = [
    [accent, "#FF8E8E"],
    ["#4ECDC4", "#7EDDD6"],
    ["#45B7D1", "#6BC5D8"],
    ["#96CEB4", "#B8DCC6"],
    ["#FFEAA7", "#FFF2CC"],
    ["#DDA0DD", "#E6B3E6"],
  ];

  const icons = [
    "flower-outline",
    "leaf-outline",
    "sunny-outline",
    "moon-outline",
    "star-outline",
    "heart-outline",
  ];

  return (
    <LinearGradient
      colors={[background, card]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {/* <Ionicons name="flower" size={28} color={accent} /> */}
            <Text
              style={[styles.header, { color: textColor }]}
              numberOfLines={2}
            >
              🕉|| आरती, चालीसा और स्तोत्र संग्रह ||🕉
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {categories.map((cat, idx) => (
                <TouchableOpacity
                  key={cat.key}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/details",
                      params: { category: cat.key },
                    })
                  }
                  style={styles.cardContainer}
                >
                  <LinearGradient
                    colors={
                      [...colors[idx % colors.length]] as [string, string]
                    }
                    style={styles.card}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons
                      name={icons[idx % icons.length] as any}
                      size={28}
                      color={textColor}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.title}>{cat.key}</Text>
                    <Text style={styles.subtitle}>{cat.count} items</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginHorizontal: 8,
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 26,
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
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cardIcon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
});
