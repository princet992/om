import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OtherScreen() {
  const bg = useThemeColor({}, "background");
  const titleColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "muted");
  return (
    <LinearGradient
      colors={[bg, bg]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <Text style={[styles.title, { color: titleColor }]}>More</Text>
          <Text style={[styles.subtitle, { color: subtitleColor }]}>
            Additional features and settings
          </Text>
        </ThemedView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
  },
});
