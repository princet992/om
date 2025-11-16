import { useThemeColor } from "@/hooks/use-theme-color";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function Info() {
  const { label, info } = useLocalSearchParams();
  const accentColor = "#B85C38";

  const normalizedLabel = Array.isArray(label) ? label[0] : label || "";
  const normalizedInfo = Array.isArray(info) ? info[0] : info || "";

  const baseScale = useSharedValue(1);
  const pinchScale = useSharedValue(1);

  const MIN_SCALE = 1.0;
  const MAX_SCALE = 2.2;
  const clamp = (n: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, n));

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      pinchScale.value = clamp(baseScale.value * event.scale);
    })
    .onEnd(() => {
      baseScale.value = clamp(pinchScale.value);
    });

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pinchScale.value, { duration: 120 }) }],
  }));

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(normalizedInfo);
  };

  const shareText = async () => {
    await Share.share({
      message: `${normalizedLabel}\n\n${normalizedInfo}`,
    });
  };

  return (
    <>
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#FFF3E0", "#FAE3C6", "#FFE5B4"]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <GestureDetector gesture={pinchGesture}>
              <Animated.View style={styles.card}>
                <Text style={styles.title}>{normalizedLabel}</Text>

                <Animated.Text style={[styles.info, animatedTextStyle]}>
                  {normalizedInfo}
                </Animated.Text>

                {/* <View style={styles.actions}>
                  <TouchableOpacity style={styles.iconButton} onPress={copyToClipboard}>
                    <Ionicons name="copy-outline" size={22} color={accentColor} />
                    <Text style={styles.actionText}>Copy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.iconButton} onPress={shareText}>
                    <Ionicons name="share-outline" size={22} color={accentColor} />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View> */}
              </Animated.View>
            </GestureDetector>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 0,
    paddingBottom: 60,
  },
  card: {
    // make the card transparent and fill available space so the gradient is full-screen
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 16,
    flex: 1,
    justifyContent: "center",
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#7B341E",
    marginBottom: 24,
    marginHorizontal: 0,
    fontFamily: "serif",
    textDecorationLine: "underline",
  },
  info: {
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "serif",
    color: "#3B2F2F",
    fontSize: 24, // increased font size
    lineHeight: 36, // adjusted for readability
    paddingHorizontal: 20, // keeps text off the screen edges
    width: "100%", // full-width text block
  },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#B85C38",
    fontWeight: "600",
  },
});
