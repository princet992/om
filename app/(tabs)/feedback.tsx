import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedbackScreen() {
  const themeText = useThemeColor({}, "text");
  const themeCard = useThemeColor({}, "card");
  const themeMuted = useThemeColor({}, "muted");
  const themeAccent = useThemeColor({}, "accent");
  const themeBackground = useThemeColor({}, "background");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert("Required", "Please enter your feedback or suggestion.");
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackMessage = `Feedback for Spiritual App\n\nName: ${
        name || "Anonymous"
      }\nEmail: ${email || "Not provided"}\n\nFeedback:\n${feedback}`;

      // Primary: open email client pre-filled to the target address
      try {
        const subject = encodeURIComponent("Feedback: Spiritual App");
        const body = encodeURIComponent(feedbackMessage);
        const mailto = `mailto:mprincet992@gmail.com?subject=${subject}&body=${body}`;
        await Linking.openURL(mailto);
        setFeedback("");
        setName("");
        setEmail("");
        return;
      } catch {
        // Fallback: try Share API
        try {
          await Share.share({
            message: feedbackMessage,
            title: "Feedback: Spiritual App",
          });
          Alert.alert(
            "Thank You!",
            "You can send this feedback via any app. We appreciate your input!",
            [
              {
                text: "OK",
                onPress: () => {
                  setFeedback("");
                  setName("");
                  setEmail("");
                },
              },
            ]
          );
          return;
        } catch {
          // Final fallback: copy to clipboard
          try {
            await Clipboard.setStringAsync(feedbackMessage);
            Alert.alert(
              "Copied!",
              "Your feedback has been copied to clipboard. You can paste it in an email to: mprincet992@gmail.com",
              [
                {
                  text: "OK",
                  onPress: () => {
                    setFeedback("");
                    setName("");
                    setEmail("");
                  },
                },
              ]
            );
            return;
          } catch {
            Alert.alert(
              "Feedback Ready",
              `Your feedback is ready. Please send it to: mprincet992@gmail.com\n\nFeedback preview:\n${feedbackMessage.substring(
                0,
                150
              )}...`
            );
            setFeedback("");
            setName("");
            setEmail("");
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      Alert.alert(
        "Thank You!",
        "Your feedback has been saved. Thank you for your input!"
      );
      setFeedback("");
      setName("");
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Helper function to add opacity to hex color
  const hexToRgba = (hex: string, opacity: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <LinearGradient
      colors={
        isDark
          ? [themeBackground, hexToRgba(themeCard, 0.5)]
          : [themeBackground, themeBackground]
      }
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: themeText }]}>
              Feedback & Suggestions
            </Text>
            <Text style={[styles.headerSubtitle, { color: themeMuted }]}>
              Help us improve the app
            </Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark
                      ? hexToRgba(themeCard, 0.8)
                      : themeCard,
                    borderColor: hexToRgba(themeMuted, 0.2),
                  },
                ]}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={48}
                  color={themeAccent}
                  style={styles.icon}
                />
                <Text style={[styles.description, { color: themeMuted }]}>
                  We value your feedback! Share your thoughts, suggestions, or
                  report any issues you have encountered. Your input helps us
                  create a better experience for everyone.
                </Text>
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark
                      ? hexToRgba(themeCard, 0.8)
                      : themeCard,
                    borderColor: hexToRgba(themeMuted, 0.2),
                  },
                ]}
              >
                <Text style={[styles.label, { color: themeText }]}>
                  Your Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark
                        ? hexToRgba(themeBackground, 0.5)
                        : hexToRgba(themeMuted, 0.1),
                      color: themeText,
                      borderColor: hexToRgba(themeMuted, 0.3),
                    },
                  ]}
                  placeholder="Enter your name"
                  placeholderTextColor={themeMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark
                      ? hexToRgba(themeCard, 0.8)
                      : themeCard,
                    borderColor: hexToRgba(themeMuted, 0.2),
                  },
                ]}
              >
                <Text style={[styles.label, { color: themeText }]}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark
                        ? hexToRgba(themeBackground, 0.5)
                        : hexToRgba(themeMuted, 0.1),
                      color: themeText,
                      borderColor: hexToRgba(themeMuted, 0.3),
                    },
                  ]}
                  placeholder="your.email@example.com"
                  placeholderTextColor={themeMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark
                      ? hexToRgba(themeCard, 0.8)
                      : themeCard,
                    borderColor: hexToRgba(themeMuted, 0.2),
                  },
                ]}
              >
                <Text style={[styles.label, { color: themeText }]}>
                  Feedback / Suggestion *
                </Text>
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: isDark
                        ? hexToRgba(themeBackground, 0.5)
                        : hexToRgba(themeMuted, 0.1),
                      color: themeText,
                      borderColor: hexToRgba(themeMuted, 0.3),
                    },
                  ]}
                  placeholder="Share your thoughts, suggestions, feature requests, or report issues..."
                  placeholderTextColor={themeMuted}
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: themeAccent,
                    opacity: isSubmitting ? 0.7 : 1,
                  },
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.submitButtonText}>Sending...</Text>
                ) : (
                  <>
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Send Feedback</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={[styles.footer, { color: themeMuted }]}>
                Your feedback helps us improve the app experience for everyone.
                Thank you!
              </Text>
            </ScrollView>
          </KeyboardAvoidingView>
        </ThemedView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
  },
  icon: {
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
});
