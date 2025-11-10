import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

import aarti from "../../data/Aarti";
import chalisa from "../../data/chalisa";
import strotam from "../../data/strotam";

export default function Details() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const key = Array.isArray(category) ? category[0] : category;
    const data = [...chalisa, ...strotam, ...aarti];
    const filtered = data.filter((d: any) => (d.category || "Uncategorized").toString() === key);
    setItems(filtered);
  }, [category]);

  const background = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <LinearGradient
      colors={isDark ? ["#0a0a0a", "#1a1a1a"] : ["#ffffff", "#f0f0f0"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={[styles.header, { color: textColor }]}>{Array.isArray(category) ? category[0] : category}</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
            {items.length > 0 ? (
              <View style={styles.grid}>
                {items.map((item, index) => {
                  const itemId = (item._id || item.id).toString();
                  return (
                    <Animated.View key={itemId} entering={FadeInDown.delay(index * 80).springify()}>
                      <TouchableOpacity
                        style={[
                          styles.card,
                          {
                            backgroundColor: cardColor,
                            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)",
                          },
                        ]}
                        activeOpacity={0.85}
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
                        <View style={styles.cardLeft}>
                          <Ionicons name="leaf-outline" size={24} color={isDark ? "#FFD700" : "#E65100"} />
                        </View>
                        <View style={styles.cardRight}>
                          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                            {item.title}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={muted} style={{ marginLeft: 6 }} />
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="musical-notes-outline" size={64} color={muted} />
                <Text style={[styles.emptyText, { color: muted }]}>No items found in this category.</Text>
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
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  grid: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  cardRight: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
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
