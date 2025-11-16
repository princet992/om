import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import aarti from "../../data/Aarti";
import chalisa from "../../data/chalisa";
import strotam from "../../data/strotam";
import { extractDeity, deityHindiNames, deityDisplayNames } from "../../utils/deityUtils";

interface PlaylistItem {
  id: string;
  title: string;
  deity: string;
  language: string;
  imageUrl: string;
  content?: string;
  audio?: string;
}

interface DayPlaylist {
  day: string;
  items: PlaylistItem[];
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_COLORS = {
  Monday: ["#F857A6", "#FF5858"],
  Tuesday: ["#FF512F", "#F09819"],
  Wednesday: ["#16A085", "#2ECC71"],
  Thursday: ["#4776E6", "#8E54E9"],
  Friday: ["#C33764", "#1D2671"],
  Saturday: ["#41295A", "#2F0743"],
  Sunday: ["#FF6A00", "#EE0979"],
} as const;

const getDefaultImage = (deity: string) => {
  const map: Record<string, string> = {
    Hanuman:
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/Hanuman_Image.jpg",
    Shiva:
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Lord_Shiva_Meditation.jpg",
    Durga:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Goddess_Durga_Artwork.jpg",
  };
  return (
    map[deity] ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
  );
};

const convertToPlaylistItems = (data: any[], type: string): PlaylistItem[] =>
  data.map((item, index) => {
    const deity = extractDeity(item);
    return {
      id: `${type}-${item._id || item.id || index}`,
      title: item.title || item.name || "Untitled",
      deity: deity || "Other",
      language: item.language || "Hindi",
      imageUrl: item.imageUrl || getDefaultImage(deity),
      content:
        item.content ||
        `${item.title} - A beautiful ${type.toLowerCase()} for spiritual practice.`,
      audio: item.audio,
    };
  });

const ALL_CONTENT: PlaylistItem[] = [
  ...convertToPlaylistItems(chalisa, "Chalisa"),
  ...convertToPlaylistItems(strotam, "Strotam"),
  ...convertToPlaylistItems(aarti, "Aarti"),
];

const STORAGE_KEY = "user_playlist_v1";

export default function PlaylistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeText = useThemeColor({}, "text");
  const themeMuted = useThemeColor({}, "muted");
  const themeBackground = useThemeColor({}, "background");

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [playlists, setPlaylists] = useState<DayPlaylist[]>(
    DAYS_OF_WEEK.map((d) => ({ day: d, items: [] }))
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadedRef = useRef(false);
  const saveTimerRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const normalized = DAYS_OF_WEEK.map(
          (day) =>
            parsed.find((p: DayPlaylist) => p.day === day) || { day, items: [] }
        );
        setPlaylists(normalized);
      }
      loadedRef.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(
      () => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playlists)),
      300
    );
    return () => clearTimeout(saveTimerRef.current);
  }, [playlists]);

  const currentPlaylist = playlists.find((p) => p.day === selectedDay) || {
    day: selectedDay,
    items: [],
  };

  const categories = [
    "All",
    ...Array.from(new Set(ALL_CONTENT.map((i) => i.deity))),
  ];

  const filteredBhajans = ALL_CONTENT.filter((i) => {
    const s = searchQuery.toLowerCase();
    const match =
      i.title.toLowerCase().includes(s) ||
      i.deity.toLowerCase().includes(s) ||
      i.language.toLowerCase().includes(s);
    const matchCat = selectedCategory === "All" || i.deity === selectedCategory;
    return match && matchCat;
  });

  const addToPlaylist = (item: PlaylistItem) => {
    const pl = playlists.find((p) => p.day === selectedDay);
    if (!pl) return;
    if (pl.items.some((x) => x.id === item.id)) return;
    setPlaylists((prev) =>
      prev.map((p) =>
        p.day === selectedDay ? { ...p, items: [...p.items, item] } : p
      )
    );
    setShowAddModal(false);
  };

  const removeFromPlaylist = (id: string) =>
    setPlaylists((prev) =>
      prev.map((p) =>
        p.day === selectedDay
          ? { ...p, items: p.items.filter((i) => i.id !== id) }
          : p
      )
    );

  return (
    <LinearGradient
      colors={DAY_COLORS[selectedDay as keyof typeof DAY_COLORS]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>मेरी साप्ताहिक भजन योजना</Text>
          <Text style={styles.headerSubtitle}>
            My Weekly Bhajan Plan
          </Text>
        </View>

        {/* DAYS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayScroll}
        >
          {DAYS_OF_WEEK.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[
                styles.dayChip,
                selectedDay === day && {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  shadowColor: "#fff",
                  shadowOpacity: 0.4,
                  shadowRadius: 4,
                  transform: [{ scale: 1.05 }],
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color:
                      selectedDay === day ? "#fff" : "rgba(255,255,255,0.85)",
                    fontWeight: selectedDay === day ? "700" : "600",
                  },
                ]}
              >
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PLAYLIST */}
        <FlatList
          data={currentPlaylist.items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <BlurView
              intensity={isDark ? 30 : 80}
              tint="light"
              style={styles.playCard}
            >
              <TouchableOpacity
                style={styles.cardInner}
                onPress={() =>
                  router.push({
                    pathname: "/screens/info",
                    params: { label: item.title, info: item.content || "" },
                  })
                }
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.itemImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemSubtitle}>
                    {deityHindiNames[item.deity] || item.deity} • {item.language}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => removeFromPlaylist(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
                </TouchableOpacity>
              </TouchableOpacity>
            </BlurView>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="musical-notes-outline"
                size={72}
                color="rgba(255,255,255,0.6)"
              />
              <Text style={styles.emptyText}>
                {selectedDay} के लिए अभी कोई भजन नहीं
              </Text>
              <Text style={styles.emptySubtext}>
                No bhajans yet for {selectedDay}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddModal(true)}
        >
          <LinearGradient
            colors={["#4ECDC4", "#45B7D1"]}
            style={styles.fabInner}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* MODAL */}
        <Modal visible={showAddModal} animationType="slide">
          <SafeAreaView
            style={[
              styles.modalContainer,
              { backgroundColor: themeBackground },
            ]}
          >
            {/* HEADER */}
            <View style={[styles.modalHeader, { 
              borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
              backgroundColor: isDark ? "#1a1a1a" : "#fff",
            }]}>
              <View>
                <Text style={[styles.modalTitle, { color: themeText }]}>
                  भजन जोड़ें
                </Text>
                <Text style={[styles.modalSubtitle, { color: themeMuted }]}>
                  Add Bhajan
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={[styles.closeButton, {
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  borderRadius: 20,
                }]}
              >
                <Ionicons name="close" size={22} color={themeText} />
              </TouchableOpacity>
            </View>

            {/* SEARCH */}
            <View
              style={[
                styles.searchBar,
                { 
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                },
              ]}
            >
              <Ionicons name="search" size={20} color={themeMuted} />
              <TextInput
                placeholder="भजन खोजें..."
                placeholderTextColor={themeMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchInput, { color: themeText }]}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color={themeMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* CATEGORY SCROLL */}
            <View style={styles.categorySection}>
              <Text style={[styles.categoryLabel, { color: themeMuted }]}>
                श्रेणी / Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {categories.map((c) => {
                  const isSelected = selectedCategory === c;
                  const chipColor = isDark 
                    ? (isSelected ? "#4ECDC4" : "transparent")
                    : (isSelected ? "#1976D2" : "transparent");
                  
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setSelectedCategory(c)}
                      activeOpacity={0.7}
                      style={[
                        styles.chip,
                        isSelected
                          ? { 
                              backgroundColor: chipColor,
                              shadowColor: chipColor,
                              shadowOpacity: 0.4,
                              shadowRadius: 6,
                              shadowOffset: { width: 0, height: 2 },
                              elevation: 4,
                              transform: [{ scale: 1.02 }],
                            }
                          : { 
                              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                              borderWidth: 1.5,
                              borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                            },
                      ]}
                    >
                      {isSelected && (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={16} 
                          color="#fff" 
                          style={{ marginRight: 6 }}
                        />
                      )}
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? "#fff" : themeText,
                            fontWeight: isSelected ? "700" : "600",
                          },
                        ]}
                      >
                        {c === "All" ? "सभी" : deityHindiNames[c] || c}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* BHAJAN LIST */}
            <FlatList
              data={filteredBhajans}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.addItem,
                    {
                      backgroundColor: isDark
                        ? "#333"
                        : "rgba(255,255,255,0.05)",
                    },
                  ]}
                  onPress={() => addToPlaylist(item)}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.addImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.addTitle, { color: themeText }]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <Text style={[styles.addSubtitle, { color: themeMuted }]}>
                      {deityHindiNames[item.deity] || item.deity} • {item.language}
                    </Text>
                  </View>
                  <View style={[styles.addButton, {
                    backgroundColor: isDark ? "rgba(78, 205, 196, 0.2)" : "rgba(25, 118, 210, 0.1)",
                  }]}>
                    <Ionicons
                      name="add-circle"
                      size={28}
                      color={isDark ? "#4ECDC4" : "#1976D2"}
                    />
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    fontSize: 14,
  },
  dayScroll: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },

  dayChip: {
    marginRight: 8,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    minWidth: 52,
    alignItems: "center",
  },

  dayText: {
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.4,
  },

  playCard: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardInner: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  itemImage: { 
    width: 70, 
    height: 70, 
    borderRadius: 14, 
    marginRight: 14,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#1a1a1a",
    marginBottom: 4,
  },
  itemSubtitle: { 
    fontSize: 13, 
    color: "#666",
    fontWeight: "500",
  },
  listContainer: { paddingVertical: 20 },
  empty: { 
    alignItems: "center", 
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyText: { 
    color: "rgba(255,255,255,0.9)", 
    fontWeight: "700", 
    fontSize: 18, 
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
  fab: { position: "absolute", bottom: 28, right: 24 },
  fabInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: "700",
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  closeButton: { 
    padding: 8,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 14,
    paddingHorizontal: 14,
    height: 48,
  },

  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 16,
    fontWeight: "500",
  },

  categorySection: {
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  categoryScroll: { 
    paddingHorizontal: 16, 
    paddingVertical: 4,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 80,
  },
  chipText: {
    fontSize: 14,
    letterSpacing: 0.3,
  },

  addItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  addImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 12, 
    marginRight: 14,
    backgroundColor: "rgba(0,0,0,0.05)",
  },

  addTitle: { 
    fontSize: 16, 
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 22,
  },
  addSubtitle: { 
    fontSize: 13, 
    fontWeight: "500",
  },
  addButton: {
    padding: 4,
    borderRadius: 16,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
});
