import type { DevotionalCollections, DevotionalItem } from "@/types/devotional";

const DEFAULT_BASE_URL = "http://localhost:4000/api";

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.replace(/\/$/, "");
  }
  return DEFAULT_BASE_URL;
};

type QueryParams = Partial<{
  deity: string;
  category: string;
  search: string;
  limit: number;
}>;

const buildQuery = (params?: QueryParams) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.append(key, value.toString());
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const request = async <T>(path: string, params?: QueryParams): Promise<T> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}${buildQuery(params)}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to fetch data from Devotional API");
  }

  return response.json() as Promise<T>;
};

export const fetchCollections = (params?: QueryParams) =>
  request<DevotionalCollections>("/collections", params);

export const fetchItemsByType = (type: "aarti" | "chalisa" | "strotam", params?: QueryParams) =>
  request<DevotionalItem[]>(`/${type}`, params);

export const fetchAllItems = (params?: QueryParams) =>
  request<DevotionalItem[]>("/items", params);

