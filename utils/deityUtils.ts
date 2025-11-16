// Utility function to extract deity name from title or author
export const extractDeity = (item: any): string => {
  const title = (item.title || "").toLowerCase();
  const author = (item.author || "").toLowerCase();
  
  // Deity mapping (Hindi to English)
  const deityMap: Record<string, string> = {
    "हनुमान": "Hanuman",
    "hanuman": "Hanuman",
    "शिव": "Shiv",
    "shiva": "Shiv",
    "shiv": "Shiv",
    "रुद्र": "Shiv",
    "rudra": "Shiv",
    "शनि": "Shani",
    "shani": "Shani",
    "राम": "Ram",
    "ram": "Ram",
    "कृष्ण": "Krishna",
    "krishna": "Krishna",
    "दुर्गा": "Durga",
    "durga": "Durga",
    "लक्ष्मी": "Lakshmi",
    "lakshmi": "Lakshmi",
    "गणेश": "Ganesh",
    "ganesh": "Ganesh",
    "गणपति": "Ganesh",
    "ganpati": "Ganesh",
    "सरस्वती": "Saraswati",
    "saraswati": "Saraswati",
    "विष्णु": "Vishnu",
    "vishnu": "Vishnu",
    "ब्रह्मा": "Brahma",
    "brahma": "Brahma",
    "काली": "Kali",
    "kali": "Kali",
    "सूर्य": "Surya",
    "surya": "Surya",
    "चंद्र": "Chandra",
    "chandra": "Chandra",
    "भैरव": "Bhairav",
    "bhairav": "Bhairav",
  };

  // Check title first
  for (const [hindi, english] of Object.entries(deityMap)) {
    if (title.includes(hindi)) {
      return english;
    }
  }

  // Check author field
  for (const [hindi, english] of Object.entries(deityMap)) {
    if (author.includes(hindi)) {
      return english;
    }
  }

  // Default to "Other" if no deity found
  return "Other";
};

// Deity icons mapping
export const deityIcons: Record<string, string> = {
  "Hanuman": "flame-outline",
  "Shiv": "moon-outline",
  "Ram": "sunny-outline",
  "Krishna": "musical-notes-outline",
  "Durga": "shield-outline",
  "Lakshmi": "diamond-outline",
  "Ganesh": "leaf-outline",
  "Shani": "planet-outline",
  "Saraswati": "book-outline",
  "Vishnu": "infinite-outline",
  "Brahma": "star-outline",
  "Kali": "flash-outline",
  "Surya": "sunny-outline",
  "Chandra": "moon-outline",
  "Bhairav": "skull-outline",
  "Other": "help-circle-outline",
};

// Deity order for consistent sorting
export const deityOrder = [
  "Hanuman",
  "Shiv",
  "Ram",
  "Krishna",
  "Durga",
  "Lakshmi",
  "Ganesh",
  "Shani",
  "Saraswati",
  "Vishnu",
  "Brahma",
  "Kali",
  "Surya",
  "Chandra",
  "Bhairav",
  "Other",
];

// Hindi translations for deities with Dev/Bhagwan/Mata
export const deityHindiNames: Record<string, string> = {
  "Hanuman": "हनुमान देव",
  "Shiv": "शिव भगवान",
  "Ram": "राम भगवान",
  "Krishna": "कृष्ण भगवान",
  "Durga": "दुर्गा माता",
  "Lakshmi": "लक्ष्मी माता",
  "Ganesh": "गणेश देव",
  "Shani": "शनि देव",
  "Saraswati": "सरस्वती माता",
  "Vishnu": "विष्णु भगवान",
  "Brahma": "ब्रह्मा भगवान",
  "Kali": "काली माता",
  "Surya": "सूर्य देव",
  "Chandra": "चंद्र देव",
  "Bhairav": "भैरव देव",
  "Other": "अन्य",
};

// Display names with Dev/Bhagwan/Mata for English
export const deityDisplayNames: Record<string, string> = {
  "Hanuman": "Hanuman Dev",
  "Shiv": "Shiv Bhagwan",
  "Ram": "Ram Bhagwan",
  "Krishna": "Krishna Bhagwan",
  "Durga": "Durga Mata",
  "Lakshmi": "Lakshmi Mata",
  "Ganesh": "Ganesh Dev",
  "Shani": "Shani Dev",
  "Saraswati": "Saraswati Mata",
  "Vishnu": "Vishnu Bhagwan",
  "Brahma": "Brahma Bhagwan",
  "Kali": "Kali Mata",
  "Surya": "Surya Dev",
  "Chandra": "Chandra Dev",
  "Bhairav": "Bhairav Dev",
  "Other": "Other",
};

// Hindi translations for types
export const typeHindiNames: Record<string, string> = {
  "Chalisa": "चालीसा",
  "Strotam": "स्तोत्र",
  "Aarti": "आरती",
};

