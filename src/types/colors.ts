interface ColorSettings {
  // Page & Layout
  pageBackground: string;
  
  // Typography Colors
  defaultText: string;
  correctText: string;
  wrongText: string;
  
  // Interactive Elements
  progressBar: string;
  cursor: string;
}

const defaultColors: ColorSettings = {
  // Page & Layout
  pageBackground: "#ffffff",
  
  // Typography Colors
  defaultText: "#6b7280",
  correctText: "#10b981",
  wrongText: "#ef4444",
  
  // Interactive Elements
  progressBar: "#3b82f6",
  cursor: "#f59e0b",
};

const colorLabels: Record<keyof ColorSettings, string> = {
  pageBackground: "Page Background",
  defaultText: "Default Text",
  correctText: "Correct Text",
  wrongText: "Wrong Text",
  progressBar: "Progress Bar",
  cursor: "Cursor",
};

export type { ColorSettings };
export { defaultColors, colorLabels };