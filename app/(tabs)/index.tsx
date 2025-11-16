import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import aarti from "../../data/Aarti";
import chalisa from "../../data/chalisa";
import strotam from "../../data/strotam";
import { extractDeity, deityIcons, deityOrder, deityHindiNames, deityDisplayNames } from "../../utils/deityUtils";

export default function HomeScreen() {
  const router = useRouter();
  const [deities, setDeities] = useState<{ key: string; count: number }[]>([]);

  useEffect(() => {
    const data = [...chalisa, ...strotam, ...aarti];
    const map: Record<string, number> = {};
    
    // Group all items by deity (across Chalisa, Strotam, and Aarti)
    data.forEach((item: any) => {
      const deity = extractDeity(item);
      map[deity] = (map[deity] || 0) + 1;
    });

    // Sort alphabetically by deity name
    const sortedDeities = deityOrder
      .filter((deity) => map[deity] && map[deity] > 0)
      .map((deity) => ({ key: deity, count: map[deity] }))
      .sort((a, b) => a.key.localeCompare(b.key));
    
    setDeities(sortedDeities);
  }, []);

  const background = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <LinearGradient 
      colors={isDark ? ["#0a0a0a", "#1a1a1a"] : ["#ffffff", "#f5f5f5"]} 
      style={{ flex: 1 }} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={[styles.header, { color: textColor }]}>🕉 आरती, चालीसा और स्तोत्र संग्रह 🕉</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {deities.map((deity, idx) => (
            <Animated.View 
              key={deity.key} 
              entering={FadeInDown.delay(idx * 50).springify()}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/screens/details",
                    params: { deity: deity.key },
                  })
                }
                style={[
                  styles.listItem,
                  {
                    backgroundColor: cardColor,
                    borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)",
                  },
                ]}
              >
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={deityIcons[deity.key] as any || "help-circle-outline"} 
                    size={28} 
                    color={isDark ? "#FFD700" : "#E65100"} 
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.deityName, { color: textColor }]}>
                    {deityHindiNames[deity.key] || deity.key}
                  </Text>
                  <Text style={[styles.deityNameEnglish, { color: muted }]}>
                    {deityDisplayNames[deity.key] || deity.key}
                  </Text>
                  <Text style={[styles.itemCount, { color: muted }]}>
                    {deity.count} {deity.count === 1 ? "श्लोक" : "श्लोक"}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={muted} 
                  style={styles.chevron}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
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
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(230, 81, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  deityName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  deityNameEnglish: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 13,
    fontWeight: "500",
  },
  chevron: {
    marginLeft: 8,
  },
});
