import { Redis } from "@upstash/redis";
import type { SiteConfig } from "@/types/config";
import { defaultConfig } from "@/data/default-config";
import fs from "fs";
import path from "path";

const CONFIG_KEY = "b2b:site-config";
const LOCAL_CONFIG_PATH = path.join(process.cwd(), "src", "data", "site-config.json");

// In-memory cache for fallback
let memoryConfig: SiteConfig | null = null;

// Support both standard Upstash Redis and Vercel KV env vars
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

// ─── Deep merge helper ────────────────────────────────────────────────────────
function mergeWithDefault(parsed: Partial<SiteConfig>): SiteConfig {
  return {
    ...defaultConfig,
    ...parsed,
    typography: { ...defaultConfig.typography, ...(parsed.typography || {}) },
    header: { ...defaultConfig.header, ...(parsed.header || {}) },
    sections: { ...defaultConfig.sections, ...(parsed.sections || {}) },
    agency: { ...defaultConfig.agency, ...(parsed.agency || {}) },
    footer: { ...defaultConfig.footer, ...(parsed.footer || {}) },
    whyUs: Array.isArray(parsed.whyUs) ? parsed.whyUs : defaultConfig.whyUs,
    studioServices: Array.isArray(parsed.studioServices) ? parsed.studioServices : defaultConfig.studioServices,
    impact: Array.isArray(parsed.impact) ? parsed.impact : defaultConfig.impact,
    recipe: Array.isArray(parsed.recipe) ? parsed.recipe : defaultConfig.recipe,
    marks: Array.isArray(parsed.marks) ? parsed.marks : defaultConfig.marks,
    filmPrograms: Array.isArray(parsed.filmPrograms) ? parsed.filmPrograms : defaultConfig.filmPrograms,
    projects: Array.isArray(parsed.projects) ? parsed.projects : defaultConfig.projects,
  };
}

function readLocalFsConfig(): SiteConfig {
  try {
    if (fs.existsSync(LOCAL_CONFIG_PATH)) {
      const raw = fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8");
      return mergeWithDefault(JSON.parse(raw));
    }
  } catch (e) {
    console.warn("Could not read local site-config.json:", e);
  }
  return defaultConfig;
}

function writeLocalFsConfig(config: SiteConfig): boolean {
  try {
    fs.writeFileSync(LOCAL_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function getSiteConfig(): Promise<SiteConfig> {
  const db = getRedis();

  if (db) {
    try {
      const stored = await db.get<Partial<SiteConfig>>(CONFIG_KEY);
      if (stored) return mergeWithDefault(stored);
    } catch (error) {
      console.error("Redis getSiteConfig error, falling back:", error);
    }
  }

  if (memoryConfig) {
    return memoryConfig;
  }

  return readLocalFsConfig();
}

export async function saveSiteConfig(newConfig: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await getSiteConfig();
  const merged: SiteConfig = {
    ...current,
    ...newConfig,
    typography: { ...current.typography, ...(newConfig.typography || {}) },
    header: { ...current.header, ...(newConfig.header || {}) },
    sections: { ...current.sections, ...(newConfig.sections || {}) },
    agency: { ...current.agency, ...(newConfig.agency || {}) },
    footer: { ...current.footer, ...(newConfig.footer || {}) },
    whyUs: Array.isArray(newConfig.whyUs) ? newConfig.whyUs : current.whyUs,
    studioServices: Array.isArray(newConfig.studioServices) ? newConfig.studioServices : current.studioServices,
    impact: Array.isArray(newConfig.impact) ? newConfig.impact : current.impact,
    recipe: Array.isArray(newConfig.recipe) ? newConfig.recipe : current.recipe,
    marks: Array.isArray(newConfig.marks) ? newConfig.marks : current.marks,
    filmPrograms: Array.isArray(newConfig.filmPrograms) ? newConfig.filmPrograms : current.filmPrograms,
    projects: Array.isArray(newConfig.projects) ? newConfig.projects : current.projects,
  };

  const db = getRedis();

  if (db) {
    await db.set(CONFIG_KEY, merged);
    memoryConfig = merged;
    return merged;
  }

  // If no Redis configured, try local filesystem (dev environment)
  const savedLocally = writeLocalFsConfig(merged);
  memoryConfig = merged;

  if (!savedLocally && process.env.NODE_ENV === "production") {
    throw new Error(
      "Database not connected. Please add Upstash Redis or Vercel KV environment variables (UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN) in Vercel project settings."
    );
  }

  return merged;
}

export async function resetSiteConfig(): Promise<SiteConfig> {
  const db = getRedis();

  if (db) {
    await db.set(CONFIG_KEY, defaultConfig);
  }

  writeLocalFsConfig(defaultConfig);
  memoryConfig = defaultConfig;
  return defaultConfig;
}

