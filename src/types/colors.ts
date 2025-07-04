interface ColorSettings {
  // Page & Layout
  pageBackground: string;
  cardBackground: string;
  
  // Typography Colors
  defaultText: string;
  correctText: string;
  wrongText: string;
  interfaceText: string;
  mutedText: string;
  
  // Interactive Elements
  progressBar: string;
  cursor: string;
}

const defaultColors: ColorSettings = {
  // Page & Layout
  pageBackground: "#ffffff",
  cardBackground: "#f9fafb",
  
  // Typography Colors
  defaultText: "#6b7280",
  correctText: "#10b981",
  wrongText: "#ef4444",
  interfaceText: "#374151",
  mutedText: "#9ca3af",
  
  // Interactive Elements
  progressBar: "#3b82f6",
  cursor: "#f59e0b",
};

const colorLabels: Record<keyof ColorSettings, string> = {
  pageBackground: "Page Background",
  cardBackground: "Card Background",
  defaultText: "Default Text",
  correctText: "Correct Text",
  wrongText: "Wrong Text",
  interfaceText: "Interface Text",
  mutedText: "Muted Text",
  progressBar: "Progress Bar",
  cursor: "Cursor",
};

export type { ColorSettings };
export { defaultColors, colorLabels };