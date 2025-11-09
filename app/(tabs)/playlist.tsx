import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  Monday: ["#FF6B6B", "#FF8E8E"],
  Tuesday: ["#4ECDC4", "#7EDDD6"],
  Wednesday: ["#45B7D1", "#6BC5D8"],
  Thursday: ["#96CEB4", "#B8DCC6"],
  Friday: ["#FFEAA7", "#FFF2CC"],
  Saturday: ["#DDA0DD", "#E6B3E6"],
  Sunday: ["#FFB347", "#FFC966"],
};

const DAY_IMAGES = {
  Monday:
    "https://images.unsplash.com/photo-1609609830354-8f615d61b9c8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpdmF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
  Tuesday:
    "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFudW1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  Wednesday:
    "https://images.unsplash.com/photo-1607604760190-ec9ccc12156e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FuZXNofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
  Thursday:
    "https://plus.unsplash.com/premium_photo-1700752733721-bceab91f2b86?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a3Jpc2huYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  Friday:
    "https://media.istockphoto.com/id/2180683782/photo/dhanteras-goddess-feet-rangoli-diwali-festival-celebration-to-worship-laxmi-charan-paduka.webp?a=1&b=1&s=612x612&w=0&k=20&c=8gvX7gKn6yoSFV56YnoffZjzexCioz71VWVR5oqe1JE=",
  Saturday:
    "https://images.unsplash.com/photo-1572945015532-741f8c49a7b2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwdGVtcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
  Sunday:
    "https://images.unsplash.com/photo-1572945015532-741f8c49a7b2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwdGVtcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
};

// Convert real data to PlaylistItem format
const convertToPlaylistItems = (data: any[], type: string): PlaylistItem[] => {
  return data.map((item, index) => ({
    id: `${type}-${item._id || item.id || index}`,
    title: item.title || item.name || "Untitled",
    deity: item.deity || item.category || "Universal",
    language: item.language || "Hindi",
    imageUrl: item.imageUrl || getDefaultImage(item.deity || item.category),
    content:
      item.content ||
      item.description ||
      `${
        item.title
      } - A beautiful ${type.toLowerCase()} for spiritual practice.`,
    audio: item.audio,
  }));
};

const getDefaultImage = (deity: string): string => {
  const imageMap: { [key: string]: string } = {
    Hanuman:
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/Hanuman_Image.jpg",
    Shiva:
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Lord_Shiva_Meditation.jpg",
    Durga:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Goddess_Durga_Artwork.jpg",
    Rama: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    Krishna:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    Ganesha:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    Lakshmi:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
  };
  return (
    imageMap[deity] ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
  );
};

// Combine all available content
const ALL_AVAILABLE_CONTENT: PlaylistItem[] = [
  ...convertToPlaylistItems(chalisa, "Chalisa"),
  ...convertToPlaylistItems(strotam, "Strotam"),
  ...convertToPlaylistItems(aarti, "Aarti"),
];

const STORAGE_KEY = "user_playlist_v1";

// Helper function to add opacity to hex color
const hexToRgba = (hex: string, opacity: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function PlaylistScreen() {
  const router = useRouter();
  const themeText = useThemeColor({}, "text");
  const themeCard = useThemeColor({}, "card");
  const themeMuted = useThemeColor({}, "muted");
  const themeAccent = useThemeColor({}, "accent");
  const themeBackground = useThemeColor({}, "background");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [playlists, setPlaylists] = useState<DayPlaylist[]>(
    DAYS_OF_WEEK.map((day) => ({ day, items: [] }))
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const loadedRef = React.useRef(false);
  const saveTimerRef = React.useRef<any>(null);

  // Load persisted playlists on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as DayPlaylist[];
          // normalize to ensure all days exist
          const normalized = DAYS_OF_WEEK.map(
            (day) => parsed.find((p) => p.day === day) || { day, items: [] }
          );
          setPlaylists(normalized);
        }
      } catch (e) {
        console.warn("Failed to load playlist:", e);
      } finally {
        // mark initial load complete so we don't persist the initial state back immediately
        loadedRef.current = true;
      }
    })();
  }, []);

  // Persist playlists whenever they change (debounced)
  useEffect(() => {
    if (!loadedRef.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playlists)).catch((e) =>
        console.warn("Failed to save playlist:", e)
      );
    }, 350);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [playlists]);

  const currentPlaylist = playlists.find((p) => p.day === selectedDay) || {
    day: selectedDay,
    items: [],
  };

  const filteredBhajans = ALL_AVAILABLE_CONTENT.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.language.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      item.deity === selectedCategory ||
      item.title.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filtering
  const categories = [
    "All",
    ...Array.from(new Set(ALL_AVAILABLE_CONTENT.map((item) => item.deity))),
  ];

  const addToPlaylist = (item: PlaylistItem) => {
    try {
      const playlist = playlists.find((p) => p.day === selectedDay);
      if (!playlist) return;

      const existsById = playlist.items.some((i) => i.id === item.id);
      const existsByKeyCategory = playlist.items.some(
        (i) => i.title === item.title && i.deity === item.deity
      );

      if (existsById) {
        setShowAddModal(false);
        Alert.alert(
          "Already present",
          `${item.title} is already in ${selectedDay}'s playlist.`
        );
        return;
      }

      if (existsByKeyCategory) {
        // Warn user about likely duplicate (same title + category/deity)
        Alert.alert(
          "Possible duplicate",
          `${item.title} (${item.deity}) appears to already be in ${selectedDay}\u2019s playlist. Add duplicate?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Add",
              onPress: () => {
                const newItem = { ...item, id: `${item.id}-dup-${Date.now()}` };
                setPlaylists((prev) =>
                  prev.map((pl) =>
                    pl.day === selectedDay
                      ? { ...pl, items: [...pl.items, newItem] }
                      : pl
                  )
                );
                setShowAddModal(false);
                Alert.alert(
                  "Added!",
                  `${item.title} has been added to ${selectedDay}\u2019s playlist.`
                );
              },
            },
          ]
        );
        return;
      }

      // Normal add
      setPlaylists((prev) =>
        prev.map((pl) =>
          pl.day === selectedDay ? { ...pl, items: [...pl.items, item] } : pl
        )
      );
      setShowAddModal(false);
      Alert.alert(
        "Added!",
        `${item.title} has been added to ${selectedDay}\u2019s playlist.`
      );
    } catch (err) {
      console.warn("Failed to add to playlist:", err);
      Alert.alert("Error", "Could not add item to playlist. Please try again.");
    }
  };

  const removeFromPlaylist = (itemId: string) => {
    try {
      setPlaylists((prev) =>
        prev.map((playlist) => {
          if (playlist.day === selectedDay) {
            return {
              ...playlist,
              items: playlist.items.filter((item) => item.id !== itemId),
            };
          }
          return playlist;
        })
      );
    } catch (err) {
      console.warn("Failed to remove from playlist:", err);
      Alert.alert("Error", "Could not remove item. Please try again.");
    }
  };

  const renderPlaylistItem = ({ item }: { item: PlaylistItem }) => (
    <TouchableOpacity
      style={[
        styles.playlistItem,
        {
          backgroundColor: isDark
            ? hexToRgba(themeCard, 0.8)
            : hexToRgba(themeCard, 0.9),
          borderColor: hexToRgba(themeMuted, isDark ? 0.3 : 0.2),
        },
      ]}
      onPress={() =>
        router.push({
          pathname: "/screens/info",
          params: {
            label: item.title,
            info: item.content || "",
            audio: item.audio,
            backgroundImage: DAY_IMAGES[selectedDay as keyof typeof DAY_IMAGES],
          },
        })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text
          style={[styles.itemTitle, { color: themeText }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={[styles.itemSubtitle, { color: themeMuted }]}>
          {item.deity} • {item.language}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromPlaylist(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color={themeAccent} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderDayButton = (day: string) => {
    const isSelected = selectedDay === day;
    const colors = DAY_COLORS[day as keyof typeof DAY_COLORS];

    return (
      <TouchableOpacity
        key={day}
        style={[styles.dayButton, isSelected && styles.selectedDayButton]}
        onPress={() => setSelectedDay(day)}
      >
        <LinearGradient
          colors={
            isSelected
              ? ([...colors] as unknown as [string, string, ...string[]])
              : isDark
              ? ([
                  "rgba(255,255,255,0.15)",
                  "rgba(255,255,255,0.08)",
                ] as unknown as [string, string])
              : ([
                  "rgba(255,255,255,0.2)",
                  "rgba(255,255,255,0.1)",
                ] as unknown as [string, string])
          }
          style={styles.dayButtonGradient}
        >
          <Text
            style={[
              styles.dayButtonText,
              isSelected && styles.selectedDayButtonText,
            ]}
          >
            {day.slice(0, 3)}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderAddItem = ({ item }: { item: PlaylistItem }) => (
    <TouchableOpacity
      style={[
        styles.addItem,
        {
          backgroundColor: themeCard,
          borderColor: hexToRgba(themeMuted, 0.25),
          shadowColor: isDark ? "#000" : "#000",
        },
      ]}
      onPress={() => addToPlaylist(item)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={[
          styles.addItemImage,
          { backgroundColor: hexToRgba(themeMuted, 0.12) },
        ]}
      />
      <View style={styles.addItemInfo}>
        <Text
          style={[styles.addItemTitle, { color: themeText }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={[styles.addItemSubtitle, { color: themeMuted }]}>
          {item.deity} • {item.language}
        </Text>
      </View>
      <Ionicons name="add-circle-outline" size={24} color={themeAccent} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={
        DAY_COLORS[selectedDay as keyof typeof DAY_COLORS] as [
          string,
          string,
          ...string[]
        ]
      }
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <Text
            style={[
              styles.title,
              {
                color: isDark ? "#FFFFFF" : "#2e2b2bff",
                textShadowColor: isDark
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(0, 0, 0, 0.7)",
              },
            ]}
          >
            Weekly Playlist
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: isDark
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(255, 255, 255, 0.95)",
                textShadowColor: isDark
                  ? "rgba(0, 0, 0, 0.4)"
                  : "rgba(0, 0, 0, 0.6)",
              },
            ]}
          >
            Organize your spiritual journey by day
          </Text>

          {/* Day Selection */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.daysContainer}
            contentContainerStyle={styles.daysContent}
          >
            {DAYS_OF_WEEK.map(renderDayButton)}
          </ScrollView>

          {/* Selected Day Header */}
          <View style={styles.selectedDayHeader}>
            <Text
              style={[
                styles.selectedDayTitle,
                {
                  color: isDark ? "#FFFFFF" : "#FFFFFF",
                  textShadowColor: isDark
                    ? "rgba(0, 0, 0, 0.5)"
                    : "rgba(0, 0, 0, 0.7)",
                },
              ]}
            >
              {selectedDay}
            </Text>
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.3)",
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.4)"
                    : "rgba(255, 255, 255, 0.5)",
                },
              ]}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Playlist Items */}
          {currentPlaylist.items.length > 0 ? (
            <FlatList
              data={currentPlaylist.items}
              renderItem={renderPlaylistItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="musical-notes-outline"
                size={64}
                color={
                  isDark ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)"
                }
              />
              <Text
                style={[
                  styles.emptyText,
                  {
                    color: isDark ? "rgba(255, 255, 255, 0.9)" : "#FFFFFF",
                    textShadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                ]}
              >
                {`No items in ${selectedDay}\u2019s playlist`}
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  {
                    color: isDark
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(255, 255, 255, 0.85)",
                    textShadowColor: "rgba(0, 0, 0, 0.4)",
                  },
                ]}
              >
                {`Tap "Add" to add bhajans and chalisa`}
              </Text>
            </View>
          )}
        </ThemedView>

        {/* Add Item Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView
            style={[
              styles.modalContainer,
              { backgroundColor: themeBackground },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: hexToRgba(themeMuted, 0.25) },
              ]}
            >
              <Text style={[styles.modalTitle, { color: themeText }]}>
                Add to {selectedDay} ({filteredBhajans.length} items)
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <Ionicons name="close" size={24} color={themeMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContentWrapper}>
              {/* Search Bar */}
              <View
                style={[
                  styles.searchContainer,
                  {
                    backgroundColor: themeCard,
                    borderColor: hexToRgba(themeMuted, 0.25),
                  },
                ]}
              >
                <Ionicons
                  name="search"
                  size={20}
                  color={themeMuted}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={[styles.searchInput, { color: themeText }]}
                  placeholder="Search bhajans and chalisa..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={themeMuted}
                />
              </View>

              {/* Category Filter */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
                contentContainerStyle={styles.categoryContent}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor:
                          selectedCategory === category
                            ? themeAccent
                            : isDark
                            ? themeCard
                            : "#E5E7EB",
                        borderColor:
                          selectedCategory === category
                            ? themeAccent
                            : isDark
                            ? hexToRgba(themeMuted, 0.25)
                            : "#D1D5DB",
                      },
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        {
                          color:
                            selectedCategory === category
                              ? "#FFFFFF"
                              : themeText,
                        },
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Bhajan List */}
              <FlatList
                data={filteredBhajans}
                renderItem={renderAddItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.addListContainer}
                style={{ flex: 1 }}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  modalContentWrapper: {
    flex: 1, // content takes up 70% of modal
    paddingTop: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    fontWeight: "500",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  daysContainer: {
    marginBottom: 2,
  },
  daysContent: {
    paddingHorizontal: 4,
  },
  dayButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: "hidden",
  },
  selectedDayButton: {
    transform: [{ scale: 1.1 }],
  },
  dayButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  dayButtonText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedDayButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedDayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4, // small gap so it doesn’t touch
    marginBottom: 4,
  },
  selectedDayTitle: {
    fontSize: 24,
    fontWeight: "700",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
  playlistItem: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 12,
    marginBottom: 6,
    alignItems: "center",
    borderWidth: 1,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  itemInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  removeButton: {
    padding: 8,
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    borderRadius: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 1, // reduced gap below search bar
    borderWidth: 1,
    position: "relative",
  },

  searchIcon: {
    marginRight: 12,
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontWeight: "500",
    borderRadius: 16,
    paddingStart: 40,
  },
  addListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12, // reduced padding so list sits closer
  },
  addItem: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addItemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  addItemInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  addItemTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  addItemSubtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryContainer: {
    marginHorizontal: 16,
    marginBottom: 8, // tighter spacing below category chips
    minHeight: 26,
  },
  categoryContent: {
    paddingHorizontal: 4,
    alignItems: "center",
    paddingVertical: 2, // adds a bit of balance without big gaps
  },

  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedCategoryButton: {},
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectedCategoryButtonText: {},
});
