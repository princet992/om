import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function FeedbackScreen() {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const textColor = useThemeColor({}, "text");
  const bgCard = useThemeColor({}, "card");
  const bgAccent = useThemeColor({}, "accent");
  const bgMuted = useThemeColor({}, "muted");
  const bgScreen = useThemeColor({}, "background");

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert("Required", "Please enter your feedback.");
      return;
    }

    setLoading(true);
    const message = `Feedback\n\nName: ${name || "Anonymous"}\nEmail: ${email || "Not provided"}\n\n${feedback}`;

    try {
      const mailto = `mailto:mprincet992@gmail.com?subject=App Feedback&body=${encodeURIComponent(message)}`;
      await Linking.openURL(mailto);
      setFeedback("");
      setName("");
      setEmail("");
    } catch {
      try {
        await Share.share({ message });
      } catch {
        await Clipboard.setStringAsync(message);
        Alert.alert("Copied!", "Feedback copied to clipboard. You can paste it into an email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgScreen }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animated.View
            entering={FadeInUp.springify().delay(100)}
            style={[
              styles.card,
              {
                backgroundColor: bgCard,
                shadowColor: isDark ? "#000" : "#aaa",
              },
            ]}
          >
            <Animated.View entering={FadeInDown.delay(200)}>
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color={bgAccent}
                style={{ alignSelf: "center", marginBottom: 8 }}
              />
            </Animated.View>

            <Text style={[styles.title, { color: textColor }]}>Feedback & Suggestions</Text>
            <Text style={[styles.subtitle, { color: bgMuted }]}>
              We value your input. Share your ideas or report an issue.
            </Text>

            <Animated.View entering={FadeInUp.delay(300)}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    backgroundColor: isDark ? "#1E1E1E" : "#F6F6F6",
                  },
                ]}
                placeholder="Your Name"
                placeholderTextColor={bgMuted}
                value={name}
                onChangeText={setName}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400)}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    backgroundColor: isDark ? "#1E1E1E" : "#F6F6F6",
                  },
                ]}
                placeholder="Email (optional)"
                placeholderTextColor={bgMuted}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500)}>
              <TextInput
                style={[
                  styles.textarea,
                  {
                    color: textColor,
                    backgroundColor: isDark ? "#1E1E1E" : "#F6F6F6",
                  },
                ]}
                placeholder="Write your feedback..."
                placeholderTextColor={bgMuted}
                multiline
                numberOfLines={6}
                value={feedback}
                onChangeText={setFeedback}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600)}>
              <Pressable onPress={handleSubmit} disabled={loading} style={{ borderRadius: 10, overflow: "hidden" }}>
                <LinearGradient
                  colors={["#4ECDC4", "#45B7D1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
                >
                  <Ionicons name="send" color="#fff" size={18} />
                  <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Feedback"}</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>

            <Text style={[styles.footer, { color: bgMuted }]}>
              Your feedback helps us make the app better for everyone.
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, justifyContent: "center" },
  card: {
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 18,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textarea: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 120,
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,
  },
});
