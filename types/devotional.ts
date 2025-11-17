export type DevotionalItem = {
  id: string | number;
  title: string;
  author?: string;
  content: string;
  source?: string;
  category?: string;
  audio?: string;
};

export type DevotionalCollections = {
  aarti: DevotionalItem[];
  chalisa: DevotionalItem[];
  strotam: DevotionalItem[];
};

