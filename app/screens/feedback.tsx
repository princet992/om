import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInUp, FadeInDown, FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedbackScreen() {
  const router = useRouter();
  const themeText = useThemeColor({}, "text");
  const themeCard = useThemeColor({}, "card");
  const themeMuted = useThemeColor({}, "muted");
  const themeAccent = useThemeColor({}, "accent");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hexToRgba = (hex: string, opacity: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert("Required", "Please enter your feedback or suggestion.");
      return;
    }

    setIsSubmitting(true);
    const feedbackMessage = `Feedback for Spiritual App\n\nName: ${
      name || "Anonymous"
    }\nEmail: ${email || "Not provided"}\n\nFeedback:\n${feedback}`;

    try {
      await Share.share({
        message: feedbackMessage,
        title: "Feedback: Spiritual App",
      });
      Alert.alert("Thank You!", "We appreciate your input 🙏", [{ text: "OK", onPress: resetForm }]);
    } catch {
      try {
        const Clipboard = await import("expo-clipboard");
        await Clipboard.setStringAsync(feedbackMessage);
        Alert.alert(
          "Copied!",
          "Your feedback has been copied. You can paste it into an email to feedback@example.com.",
          [{ text: "OK", onPress: resetForm }]
        );
      } catch {
        Alert.alert("Error", "Unable to send feedback. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFeedback("");
    setName("");
    setEmail("");
  };

  return (
    <LinearGradient
      colors={isDark ? ["#0f0f0f", "#1a1a1a", "#2d2d2d"] : ["#fffaf2", "#fef4e6", "#fdeed8"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={24} color={themeText} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: themeText }]}>Feedback & Suggestions</Text>
            <View style={{ width: 24 }} />
          </Animated.View>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              
              <Animated.View
                entering={FadeInDown.delay(200).springify()}
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? hexToRgba(themeCard, 0.8) : themeCard,
                    borderColor: hexToRgba(themeMuted, 0.2),
                  },
                ]}
              >
                <Ionicons name="chatbubbles-outline" size={54} color={themeAccent} style={styles.icon} />
                <Text style={[styles.description, { color: themeMuted, fontFamily: "serif" }]}>
                  We value your thoughts! Share ideas, report issues, or send blessings to help us make this app better. 🌼
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(300).springify()}>
                <InputField
                  label="Your Name (Optional)"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  themeText={themeText}
                  themeMuted={themeMuted}
                  isDark={isDark}
                />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(400).springify()}>
                <InputField
                  label="Email (Optional)"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  themeText={themeText}
                  themeMuted={themeMuted}
                  keyboardType="email-address"
                  isDark={isDark}
                />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(500).springify()}>
                <InputField
                  label="Feedback / Suggestion *"
                  value={feedback}
                  onChangeText={setFeedback}
                  placeholder="Share your thoughts, suggestions, or report issues..."
                  themeText={themeText}
                  themeMuted={themeMuted}
                  multiline
                  numberOfLines={8}
                  isDark={isDark}
                />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(650).springify()}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor: themeAccent,
                      opacity: isSubmitting ? 0.7 : 1,
                    },
                  ]}
                  onPress={handleSubmit}
                  activeOpacity={0.85}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color="#fff" />
                      <Text style={styles.submitButtonText}>Send Feedback</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>

              <Animated.Text
                entering={FadeIn.delay(800)}
                style={[styles.footer, { color: themeMuted, fontFamily: "serif" }]}
              >
                Your feedback helps improve the spiritual journey for everyone. Thank you for being part of this path. 🙏
              </Animated.Text>
            </ScrollView>
          </KeyboardAvoidingView>
        </ThemedView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  themeText,
  themeMuted,
  keyboardType,
  multiline = false,
  numberOfLines,
  isDark,
}: any) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.label, { color: themeText }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          {
            backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#faf9f7",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            color: themeText,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={themeMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700", flex: 1, textAlign: "center" },
  scrollContent: { padding: 16, paddingBottom: 32 },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: { marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 22, textAlign: "center" },
  inputWrapper: { marginBottom: 16 },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 8 },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: { minHeight: 120, paddingVertical: 12 },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
});
