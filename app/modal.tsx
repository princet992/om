import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const themeText = useThemeColor({}, "text");
  const themeAccent = useThemeColor({}, "accent");
  const themeCard = useThemeColor({}, "card");

  return (
    <LinearGradient colors={isDark ? ["#1a1a1a", "#000000"] : ["#fdfbfb", "#ebedee"]} style={styles.gradient}>
      <ThemedView style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(400)}
          style={[styles.card, { backgroundColor: themeCard }]}
        >
          <Ionicons name="information-circle-outline" size={64} color={themeAccent} style={{ marginBottom: 16 }} />

          <ThemedText type="title" style={[styles.title, { color: themeText }]}>
            This is a Modal
          </ThemedText>

          <ThemedText style={[styles.description, { color: themeText }]}>
            You can use this modal for alerts, info, confirmations, or quick actions.
          </ThemedText>

          <Link href="/" dismissTo style={styles.link}>
            <ThemedText type="link" style={{ color: themeAccent }}>
              Go to Home Screen
            </ThemedText>
          </Link>
        </Animated.View>
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    fontSize: 15,
    marginBottom: 20,
    opacity: 0.85,
  },
  link: {
    paddingVertical: 12,
  },
});
