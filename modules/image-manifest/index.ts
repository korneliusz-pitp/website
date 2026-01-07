import { defineNuxtModule } from "@nuxt/kit";
import { readdir, stat, writeFile, readFile } from "fs/promises";
import { join, relative } from "path";

export interface ImageFile {
  path: string;
  name: string;
  category: string;
  date?: string;
  size: number;
  modified: string;
}

export interface ManifestData {
  images: ImageFile[];
  categories: string[];
  dates: string[];
  generated: string;
}

const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

async function scanDirectory(
  dir: string,
  baseDir: string,
  parentCategory: string = ""
): Promise<ImageFile[]> {
  const images: ImageFile[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        const isDateFolder = DATE_REGEX.test(entry.name);

        if (isDateFolder) {
          const dateImages = await scanImagesInFolder(
            fullPath,
            baseDir,
            parentCategory,
            entry.name
          );
          images.push(...dateImages);
        } else {
          const subImages = await scanDirectory(fullPath, baseDir, entry.name);
          images.push(...subImages);
        }
      } else if (entry.isFile()) {
        const ext = entry.name.toLowerCase().slice(entry.name.lastIndexOf("."));
        if (IMAGE_EXTENSIONS.includes(ext)) {
          const stats = await stat(fullPath);
          const relativePath = relative(baseDir, fullPath);

          images.push({
            path: `/${relativePath.replace(/\\/g, "/")}`,
            name: entry.name,
            category: parentCategory || "uncategorized",
            size: stats.size,
            modified: stats.mtime.toISOString(),
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }

  return images;
}

async function scanImagesInFolder(
  dir: string,
  baseDir: string,
  category: string,
  date: string
): Promise<ImageFile[]> {
  const images: ImageFile[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isFile()) {
        const ext = entry.name.toLowerCase().slice(entry.name.lastIndexOf("."));
        if (IMAGE_EXTENSIONS.includes(ext)) {
          const stats = await stat(fullPath);
          const relativePath = relative(baseDir, fullPath);

          images.push({
            path: `/${relativePath.replace(/\\/g, "/")}`,
            name: entry.name,
            category,
            date,
            size: stats.size,
            modified: stats.mtime.toISOString(),
          });
        }
      } else if (entry.isDirectory()) {
        const subImages = await scanImagesInFolder(
          fullPath,
          baseDir,
          category,
          date
        );
        images.push(...subImages);
      }
    }
  } catch (error) {
    console.error(`Error scanning folder ${dir}:`, error);
  }

  return images;
}

export default defineNuxtModule({
  meta: {
    name: "image-manifest",
    configKey: "imageManifest",
  },
  defaults: {
    scanPath: "images",
    outputPath: "manifest.json",
  },
  async setup(options, nuxt) {
    nuxt.hook("build:before", async () => {
      console.log("🖼️  Generating image manifest...");

      const publicDir = join(nuxt.options.rootDir, "public");
      const imagesDir = join(publicDir, options.scanPath);

      try {
        const images = (await scanDirectory(imagesDir, publicDir)).sort(
          (a, b) => a.path.localeCompare(b.path)
        );

        const categories = [
          ...new Set(images.map((img) => img.category)),
        ].sort();
        const dates = [
          ...new Set(images.map((img) => img.date).filter(Boolean)),
        ]
          .sort()
          .reverse();

        const manifestPath = join(publicDir, options.outputPath);

        let existingManifest: ManifestData | null = null;

        try {
          const current = await readFile(manifestPath, "utf8");
          existingManifest = JSON.parse(current) as ManifestData;
        } catch {
          existingManifest = null;
        }

        const manifest: ManifestData = {
          images,
          categories,
          dates: dates as string[],
          generated: new Date().toISOString(),
        };

        const stripGenerated = (m: ManifestData | null) => {
          if (!m) return null;
          const { generated: _generated, ...rest } = m;
          return rest;
        };

        if (
          existingManifest &&
          JSON.stringify(stripGenerated(existingManifest)) ===
            JSON.stringify(stripGenerated(manifest))
        ) {
          console.log("✓ Manifest unchanged; skipping write");
        } else {
          await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
          console.log(`✓ Generated manifest with ${images.length} images`);
          console.log(`✓ Categories: ${categories.join(", ") || "none"}`);
          console.log(`✓ Date folders: ${dates.length}`);
        }
      } catch (error) {
        console.error("Error generating manifest:", error);
      }
    });
  },
});
