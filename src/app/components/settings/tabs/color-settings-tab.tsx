"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorRow } from "../../color-row";
import { ColorSettings, colorLabels } from "@/types/colors";

interface ColorSettingsTabProps {
  colors: ColorSettings;
  onColorChange: (key: keyof ColorSettings, value: string) => void;
  onReset: () => void;
}

const ColorSettingsTab = ({ colors, onColorChange, onReset }: ColorSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🎨 Color Customization</h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset to Default
        </Button>
      </div>
      
      <div className="grid gap-6">
        {/* Background Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🖼️ Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <ColorRow
              label={colorLabels.pageBackground}
              value={colors.pageBackground}
              onChange={(color) => onColorChange("pageBackground", color)}
            />
            <ColorRow
              label={colorLabels.cardBackground}
              value={colors.cardBackground}
              onChange={(color) => onColorChange("cardBackground", color)}
            />
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📝 Text Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
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
            <ColorRow
              label={colorLabels.interfaceText}
              value={colors.interfaceText}
              onChange={(color) => onColorChange("interfaceText", color)}
            />
            <ColorRow
              label={colorLabels.mutedText}
              value={colors.mutedText}
              onChange={(color) => onColorChange("mutedText", color)}
            />
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🎯 Interactive Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { ColorSettingsTab };