import { useThemeColor } from "@/hooks/use-theme-color";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  State as GHState,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Beautiful spiritual background images
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop",
];

export default function Info() {
  const { label, info, backgroundImage } = useLocalSearchParams();
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "muted");
  const accentColor = useThemeColor({}, "accent");
  const [baseScale, setBaseScale] = useState(1);
  const [scale, setScale] = useState(1);

  // Normalize params (they can be string or string[])
  const normalizedLabel = Array.isArray(label) ? label[0] : label || "";
  const normalizedInfo = Array.isArray(info) ? info[0] : info || "";

  // Use provided background image or select a random one.
  // `backgroundImage` may come from URL params as string or string[]; normalize to a single string.
  const selectedBackground =
    (Array.isArray(backgroundImage) ? backgroundImage[0] : backgroundImage) ||
    BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];

  const MIN_SCALE = 1.2;
  const MAX_SCALE = 2.5;

  function clamp(n: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, n));
  }

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    const next = clamp(baseScale * event.nativeEvent.scale);
    setScale(next);
  };

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.state === GHState.END) {
      const next = clamp(baseScale * event.nativeEvent.scale);
      setBaseScale(next);
      setScale(next);
    }
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(normalizedInfo);
      // small feedback — we could use a toast or Alert, but keep it simple
      // using console.log so it works in all environments
      console.log("Copied to clipboard");
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  const shareText = async () => {
    try {
      await Share.share({
        message: `${normalizedLabel}\n\n${normalizedInfo}`,
      });
    } catch (e) {
      console.warn("Share failed", e);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: selectedBackground }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.container}>
                <PinchGestureHandler
                  onGestureEvent={onPinchEvent}
                  onHandlerStateChange={onPinchStateChange}
                >
                  <View
                    style={[
                      styles.card,
                      { backgroundColor: cardColor, borderColor: mutedColor },
                    ]}
                  >
                    <Text style={[styles.title, { color: textColor }]}>
                      {normalizedLabel}
                    </Text>

                    {/* Info text scales with zoom for accessibility */}
                    <Text
                      style={[
                        styles.info,
                        {
                          fontSize: 16 * scale,
                          lineHeight: 26 * scale,
                          color: textColor,
                        },
                      ]}
                    >
                      {normalizedInfo}
                    </Text>

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        onPress={copyToClipboard}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[styles.actionButton, { color: accentColor }]}
                        >
                          Copy
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={shareText} activeOpacity={0.7}>
                        <Text
                          style={[styles.actionButton, { color: accentColor }]}
                        >
                          Share
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </PinchGestureHandler>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  card: {
    width: "100%",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  info: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
    fontWeight: "400",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255,99,71,0.06)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  audioText: {
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 16,
  },
  zoomControls: {
    position: "absolute",
    right: 12,
    top: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  zoomButton: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  zoomButtonPrimary: {
    backgroundColor: "#FF6B6B",
  },
  zoomResetText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  actionButton: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
});
