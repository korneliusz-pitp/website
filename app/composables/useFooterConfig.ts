import type { ButtonProps, FooterColumnLink } from "@nuxt/ui";

export type FooterContact = {
  label: string;
  email: string;
  icon?: string;
};

export type FooterBrand = {
  title?: string;
  description?: string[];
};

export type FooterConfig = {
  brand?: FooterBrand;
  socials?: ButtonProps[];
  quickLinks?: FooterColumnLink[];
  contacts?: FooterContact[];
  footnote?: string;
};

const defaultConfig: FooterConfig = {
  brand: { title: "Pups in the Park", description: [] },
  socials: [],
  quickLinks: [],
  contacts: [],
  footnote: "All rights reserved.",
};

export const useFooterConfig = async (): Promise<FooterConfig> => {
  try {
    const footerData = await queryCollection("footer").first();
    return footerData || defaultConfig;
  } catch (error) {
    console.warn(
      "Failed to load footer configuration from Nuxt Content, using defaults:",
      error
    );
    return defaultConfig;
  }
};
