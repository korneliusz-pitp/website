import type { NavigationMenuItem, ButtonProps } from "@nuxt/ui";

export type HeaderConfig = {
  title?: string;
  to?: string;
  toggle?: {
    color?:
      | "primary"
      | "secondary"
      | "neutral"
      | "error"
      | "warning"
      | "success"
      | "info";
    variant?: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
  };
  links?: NavigationMenuItem[];
  buttons?: ButtonProps[];
};

const defaultConfig: HeaderConfig = {
  title: "Pups in the Park",
  to: "/",
  toggle: {
    color: "primary",
    variant: "subtle",
  },
  links: [],
  buttons: [],
};

/**
 * Composable to fetch and manage header configuration from Nuxt Content
 *
 * This composable loads the header configuration from content/header.yml
 * and provides SSR-safe access to it.
 *
 * @returns A ref containing the header configuration
 *
 * @example
 * ```vue
 * <script setup>
 * const { data: headerConfig } = await useAsyncData('header-config', () => useHeaderConfig())
 * </script>
 * ```
 */
export const useHeaderConfig = async (): Promise<HeaderConfig> => {
  try {
    // Query the header configuration from Nuxt Content data collection
    const headerData = await queryCollection("header").first();

    if (headerData) {
      return {
        title: headerData.title || defaultConfig.title,
        to: headerData.to || defaultConfig.to,
        toggle: headerData.toggle || defaultConfig.toggle,
        links: (headerData.links as NavigationMenuItem[]) || defaultConfig.links,
        buttons: headerData.buttons || defaultConfig.buttons,
      };
    }

    return defaultConfig;
  } catch (error) {
    console.warn(
      "Failed to load header configuration from Nuxt Content, using defaults:",
      error
    );
    return defaultConfig;
  }
};
