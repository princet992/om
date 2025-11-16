import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

import aarti from "../../data/Aarti";
import chalisa from "../../data/chalisa";
import strotam from "../../data/strotam";
import { deityDisplayNames, deityHindiNames, extractDeity, typeHindiNames } from "../../utils/deityUtils";

export default function Details() {
  const { deity, category } = useLocalSearchParams();
  const router = useRouter();
  const [groupedItems, setGroupedItems] = useState<Record<string, any[]>>({});

  useEffect(() => {
    // Process each array separately to maintain source information
    const processArray = (arr: any[], type: string) => {
      let items = arr;
      
      // Filter by deity if provided
      if (deity) {
        const deityKey = Array.isArray(deity) ? deity[0] : deity;
        items = arr.filter((item: any) => {
          const itemDeity = extractDeity(item);
          return itemDeity === deityKey;
        });
      }
      // Filter by category if provided
      else if (category) {
        const key = Array.isArray(category) ? category[0] : category;
        items = arr.filter((d: any) => (d.category || "Uncategorized").toString() === key);
      }
      
      return items;
    };

    // Process each type separately
    const chalisaItems = processArray(chalisa as any[], "Chalisa");
    const strotamItems = processArray(strotam as any[], "Strotam");
    const aartiItems = processArray(aarti as any[], "Aarti");

    // Sort each array alphabetically by title
    const sortAlphabetically = (items: any[]) => {
      return [...items].sort((a, b) => {
        const titleA = (a.title || "").toLowerCase();
        const titleB = (b.title || "").toLowerCase();
        return titleA.localeCompare(titleB);
      });
    };

    // Group by type and sort alphabetically
    const grouped: Record<string, any[]> = {
      "Chalisa": sortAlphabetically(chalisaItems),
      "Strotam": sortAlphabetically(strotamItems),
      "Aarti": sortAlphabetically(aartiItems),
    };

    // Remove empty groups and maintain order: Chalisa, Strotam, Aarti
    const filteredGrouped: Record<string, any[]> = {};
    const typeOrder = ["Chalisa", "Strotam", "Aarti"];
    
    typeOrder.forEach((type) => {
      if (grouped[type] && grouped[type].length > 0) {
        filteredGrouped[type] = grouped[type];
      }
    });

    setGroupedItems(filteredGrouped);
  }, [deity, category]);

  const background = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const typeIcons: Record<string, string> = {
    "Chalisa": "book-outline",
    "Strotam": "musical-notes-outline",
    "Aarti": "flame-outline",
  };

  const typeColors: Record<string, { icon: string; bg: string }> = {
    "Chalisa": {
      icon: isDark ? "#4A90E2" : "#1976D2",
      bg: isDark ? "rgba(74, 144, 226, 0.15)" : "rgba(25, 118, 210, 0.1)",
    },
    "Strotam": {
      icon: isDark ? "#E91E63" : "#C2185B",
      bg: isDark ? "rgba(233, 30, 99, 0.15)" : "rgba(194, 24, 91, 0.1)",
    },
    "Aarti": {
      icon: isDark ? "#FF9800" : "#F57C00",
      bg: isDark ? "rgba(255, 152, 0, 0.15)" : "rgba(245, 124, 0, 0.1)",
    },
  };

  // Get the header title
  const getHeaderTitle = () => {
    if (deity) {
      const deityKey = Array.isArray(deity) ? deity[0] : deity;
      const hindiName = deityHindiNames[deityKey] || deityKey;
      const displayName = deityDisplayNames[deityKey] || deityKey;
      return `${hindiName} (${displayName})`;
    }
    if (category) {
      const categoryKey = Array.isArray(category) ? category[0] : category;
      return categoryKey;
    }
    return "सभी प्रार्थनाएं";
  };

  return (
    <LinearGradient
      colors={isDark ? ["#0a0a0a", "#1a1a1a"] : ["#ffffff", "#f0f0f0"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={[styles.header, { color: textColor }]}>{getHeaderTitle()}</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
            {Object.keys(groupedItems).length > 0 ? (
              <View style={styles.grid}>
                {Object.entries(groupedItems).map(([type, items], typeIndex) => {
                  const typeColor = typeColors[type] || { icon: muted, bg: "transparent" };
                  return (
                    <View key={type} style={styles.typeSection}>
                      <View style={[styles.typeHeader, { backgroundColor: typeColor.bg }]}>
                        <View style={styles.typeIconContainer}>
                          <Ionicons 
                            name={typeIcons[type] as any || "help-circle-outline"} 
                            size={24} 
                            color={typeColor.icon}
                          />
                        </View>
                        <View style={styles.typeTitleContainer}>
                          <Text style={[styles.typeTitle, { color: textColor }]}>
                            {typeHindiNames[type] || type}
                          </Text>
                          <Text style={[styles.typeTitleEnglish, { color: muted }]}>
                            {type}
                          </Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: typeColor.icon }]}>
                          <Text style={styles.badgeText}>{items.length}</Text>
                        </View>
                      </View>
                      {items.map((item, index) => {
                        const itemId = (item._id || item.id).toString();
                        return (
                          <Animated.View 
                            key={itemId} 
                            entering={FadeInDown.delay((typeIndex * 100 + index * 50)).springify()}
                          >
                            <TouchableOpacity
                              style={[
                                styles.card,
                                {
                                  backgroundColor: cardColor,
                                  borderLeftWidth: 3,
                                  borderLeftColor: typeColor.icon,
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
                                <View style={[styles.cardIconContainer, { backgroundColor: typeColor.bg }]}>
                                  <Ionicons 
                                    name={typeIcons[type] as any || "leaf-outline"} 
                                    size={20} 
                                    color={typeColor.icon} 
                                  />
                                </View>
                              </View>
                              <View style={styles.cardRight}>
                                <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
                                  {item.title}
                                </Text>
                              </View>
                              <Ionicons name="chevron-forward" size={20} color={muted} style={{ marginLeft: 6 }} />
                            </TouchableOpacity>
                          </Animated.View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="musical-notes-outline" size={64} color={muted} />
                <Text style={[styles.emptyText, { color: muted }]}>कोई श्लोक नहीं मिला।</Text>
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
  typeSection: {
    marginBottom: 28,
  },
  typeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  typeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  typeTitleContainer: {
    flex: 1,
    marginLeft: 4,
  },
  typeTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  typeTitleEnglish: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardLeft: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardRight: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
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
