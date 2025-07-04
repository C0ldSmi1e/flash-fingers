"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Palette, Info } from "lucide-react";
import { ColorSettings, defaultColors } from "@/types/colors";
import { ColorSettingsTab } from "./tabs/color-settings-tab";
import { AboutTab } from "./tabs/about-tab";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "color" | "about";

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("color");
  const [colors, setColors] = useState<ColorSettings>(defaultColors);

  const updateColor = (key: keyof ColorSettings, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const resetColors = () => {
    setColors(defaultColors);
  };

  const tabs = [
    { id: "color" as TabType, label: "Color", icon: Palette },
    { id: "about" as TabType, label: "About", icon: Info },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "color":
        return (
          <ColorSettingsTab 
            colors={colors}
            onColorChange={updateColor}
            onReset={resetColors}
          />
        );
      case "about":
        return <AboutTab />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden border-none bg-background">
        <div className="flex h-full min-h-[400px]">
          {/* Left Sidebar - Tabs */}
          <div className="w-32 border-r border-border pr-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </nav>
          </div>
          
          {/* Right Content Area */}
          <div className="flex-1 pl-6 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SettingsModal };