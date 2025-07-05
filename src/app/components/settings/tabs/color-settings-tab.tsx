"use client";

import { Button } from "@/components/ui/button";
import { ColorRow } from "@/app/components/color-row";
import { ColorSettings, colorLabels } from "@/types/colors";

interface ColorSettingsTabProps {
  colors: ColorSettings;
  onColorChange: (key: keyof ColorSettings, value: string) => void;
  onReset: () => void;
}

const ColorSettingsTab = ({ colors, onColorChange, onReset }: ColorSettingsTabProps) => {
  return (
    <div className="flex flex-col gap-4">
      <ColorRow
        label={colorLabels.pageBackground}
        value={colors.pageBackground}
        onChange={(color) => onColorChange("pageBackground", color)}
      />

      {/* Text Colors */}
      <ColorRow
        label={colorLabels.defaultText}
        value={colors.defaultText}
        onChange={(color) => onColorChange("defaultText", color)}
      />
      <ColorRow
        label={colorLabels.correctText}
        value={colors.correctText}
        onChange={(color) => onColorChange("correctText", color)}
      />
      <ColorRow
        label={colorLabels.wrongText}
        value={colors.wrongText}
        onChange={(color) => onColorChange("wrongText", color)}
      />

      {/* Interactive Elements */}
      <ColorRow
        label={colorLabels.progressBar}
        value={colors.progressBar}
        onChange={(color) => onColorChange("progressBar", color)}
      />
      <ColorRow
        label={colorLabels.cursor}
        value={colors.cursor}
        onChange={(color) => onColorChange("cursor", color)}
      />
      <Button variant="ghost" size="sm" onClick={onReset} className="cursor-pointer">
        Reset to Default
      </Button>
    </div>
  );
};

export { ColorSettingsTab };