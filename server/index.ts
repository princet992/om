import cors from "cors";
import express, { RequestHandler } from "express";

import aarti from "../data/Aarti";
import chalisa from "../data/chalisa";
import strotam from "../data/strotam";
import type { DevotionalCollections, DevotionalItem } from "../types/devotional";
import { extractDeity } from "../utils/deityUtils";

type QueryFilters = {
  deity?: string | string[];
  category?: string | string[];
  search?: string | string[];
  limit?: string | string[];
};

const toStringValue = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const normalize = (value?: string) => value?.toLowerCase().trim();

const filterItems = (items: DevotionalItem[], query: QueryFilters) => {
  let filtered = [...items];
  const deity = normalize(toStringValue(query.deity));
  const category = normalize(toStringValue(query.category));
  const search = normalize(toStringValue(query.search));
  const limit = Number(toStringValue(query.limit));

  if (deity) {
    filtered = filtered.filter((item) => normalize(extractDeity(item)) === deity);
  }

  if (category) {
    filtered = filtered.filter(
      (item) => normalize(item.category || "uncategorized") === category,
    );
  }

  if (search) {
    filtered = filtered.filter((item) => {
      const haystack = `${item.title || ""} ${item.author || ""} ${item.content || ""}`.toLowerCase();
      return haystack.includes(search);
    });
  }

  if (!Number.isNaN(limit) && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
};

const app = express();
app.use(cors());
app.use(express.json());

const collections = {
  aarti: aarti as DevotionalItem[],
  chalisa: chalisa as DevotionalItem[],
  strotam: strotam as DevotionalItem[],
};

const registerCollectionRoute = (path: keyof typeof collections) => {
  const handler: RequestHandler<Record<string, never>, DevotionalItem[], unknown, QueryFilters> = (req, res) => {
    const items = filterItems(collections[path], req.query as QueryFilters);
    res.json(items);
  };
  app.get(`/api/${path}`, handler);
};

registerCollectionRoute("aarti");
registerCollectionRoute("chalisa");
registerCollectionRoute("strotam");

const collectionsHandler: RequestHandler<Record<string, never>, DevotionalCollections, unknown, QueryFilters> = (
  req,
  res,
) => {
  const query = req.query as QueryFilters;
  res.json({
    aarti: filterItems(collections.aarti, query),
    chalisa: filterItems(collections.chalisa, query),
    strotam: filterItems(collections.strotam, query),
  });
};

app.get("/api/collections", collectionsHandler);

const itemsHandler: RequestHandler<Record<string, never>, DevotionalItem[], unknown, QueryFilters> = (req, res) => {
  const merged = [...collections.aarti, ...collections.chalisa, ...collections.strotam];
  const items = filterItems(merged, req.query as QueryFilters);
  res.json(items);
};

app.get("/api/items", itemsHandler);

const healthHandler: RequestHandler<Record<string, never>, { status: string }> = (_req, res) => {
  res.json({ status: "ok" });
};

app.get("/api/health", healthHandler);

const PORT = Number(process.env.API_PORT || process.env.PORT || 4000);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Devotional API running on http://localhost:${PORT}`);
});

