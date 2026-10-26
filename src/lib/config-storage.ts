import fs from "fs";
import path from "path";
import type { SiteConfig } from "@/types/config";
import { defaultConfig } from "@/data/default-config";

const CONFIG_FILE_PATH = path.join(process.cwd(), "src", "data", "site-config.json");

export function getSiteConfig(): SiteConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      // Initialize with default
      fs.mkdirSync(path.dirname(CONFIG_FILE_PATH), { recursive: true });
      fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(defaultConfig, null, 2), "utf-8");
      return defaultConfig;
    }

    const raw = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);

    // Deep merge with defaultConfig to ensure all expected properties exist
    return {
      ...defaultConfig,
      ...parsed,
      typography: {
        ...defaultConfig.typography,
        ...(parsed.typography || {}),
      },
      header: {
        ...defaultConfig.header,
        ...(parsed.header || {}),
      },
      sections: {
        ...defaultConfig.sections,
        ...(parsed.sections || {}),
      },
      agency: {
        ...defaultConfig.agency,
        ...(parsed.agency || {}),
      },
      footer: {
        ...defaultConfig.footer,
        ...(parsed.footer || {}),
      },
      whyUs: Array.isArray(parsed.whyUs) ? parsed.whyUs : defaultConfig.whyUs,
      studioServices: Array.isArray(parsed.studioServices) ? parsed.studioServices : defaultConfig.studioServices,
      impact: Array.isArray(parsed.impact) ? parsed.impact : defaultConfig.impact,
      recipe: Array.isArray(parsed.recipe) ? parsed.recipe : defaultConfig.recipe,
      marks: Array.isArray(parsed.marks) ? parsed.marks : defaultConfig.marks,
      filmPrograms: Array.isArray(parsed.filmPrograms) ? parsed.filmPrograms : defaultConfig.filmPrograms,
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaultConfig.projects,
    };
  } catch (error) {
    console.error("Error reading site config, falling back to default:", error);
    return defaultConfig;
  }
}

export function saveSiteConfig(newConfig: Partial<SiteConfig>): SiteConfig {
  const current = getSiteConfig();
  const merged: SiteConfig = {
    ...current,
    ...newConfig,
    typography: {
      ...current.typography,
      ...(newConfig.typography || {}),
    },
    header: {
      ...current.header,
      ...(newConfig.header || {}),
    },
    sections: {
      ...current.sections,
      ...(newConfig.sections || {}),
    },
    agency: {
      ...current.agency,
      ...(newConfig.agency || {}),
    },
    footer: {
      ...current.footer,
      ...(newConfig.footer || {}),
    },
    whyUs: Array.isArray(newConfig.whyUs) ? newConfig.whyUs : current.whyUs,
    studioServices: Array.isArray(newConfig.studioServices) ? newConfig.studioServices : current.studioServices,
    impact: Array.isArray(newConfig.impact) ? newConfig.impact : current.impact,
    recipe: Array.isArray(newConfig.recipe) ? newConfig.recipe : current.recipe,
    marks: Array.isArray(newConfig.marks) ? newConfig.marks : current.marks,
    filmPrograms: Array.isArray(newConfig.filmPrograms) ? newConfig.filmPrograms : current.filmPrograms,
    projects: Array.isArray(newConfig.projects) ? newConfig.projects : current.projects,
  };

  fs.mkdirSync(path.dirname(CONFIG_FILE_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}

export function resetSiteConfig(): SiteConfig {
  fs.mkdirSync(path.dirname(CONFIG_FILE_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(defaultConfig, null, 2), "utf-8");
  return defaultConfig;
}
