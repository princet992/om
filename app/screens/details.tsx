import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Use local static data instead of API calls
import aarti from "../../data/Aarti";
import chalisa from "../../data/chalisa";
import strotam from "../../data/strotam";

export default function Details() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const key = Array.isArray(category) ? category[0] : category;

    // ✅ Combine all local data sources
    const data = [...chalisa, ...strotam, ...aarti];

    // ✅ Filter by selected category
    const filtered = data.filter(
      (d: any) => (d.category || "Uncategorized").toString() === key
    );

    setItems(filtered);

    // no-op: just set items (favorites removed to simplify UI)
  }, [category]);

  // Favorites removed from this app version — simplified list UI

  const background = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <LinearGradient
      colors={[background, background]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={[styles.header, { color: textColor }]}>
            {Array.isArray(category) ? category[0] : category}
          </Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.grid}>
              {items.map((item) => {
                const itemId = (item._id || item.id).toString();

                return (
                  <View
                    key={itemId}
                    style={[
                      styles.card,
                      {
                        backgroundColor: cardColor,
                        borderColor: isDark
                          ? `rgba(155, 161, 166, 0.2)`
                          : `rgba(209, 213, 219, 0.5)`,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.contentArea}
                      onPress={() =>
                        router.push({
                          pathname: "/screens/info",
                          params: {
                            label: item.title,
                            info: item.content,
                            audio: item.audio,
                          },
                        })
                      }
                    >
                      <Text style={[styles.title, { color: textColor }]}>
                        • {item.title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            {items.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={64} color={muted} />
                <Text style={[styles.emptyText, { color: muted }]}>
                  No items found in this category.
                </Text>
              </View>
            )}
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
  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  grid: {
    // `gap` is not supported in some RN versions — use margin on children instead.
    // Individual card spacing handled via marginBottom inside card style.
  },
  card: {
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
  },
  contentArea: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 24,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
  },
});
