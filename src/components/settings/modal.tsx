"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Palette, Info } from "lucide-react";
import { useColorPersistence } from "@/hooks/useColorPersistence";
import { ColorSettingsTab } from "./tabs/color-settings-tab";
import { AboutTab } from "./tabs/about-tab";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "color" | "about";

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("color");
  const { colors, updateColor, resetColors } = useColorPersistence();

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
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-6xl h-4/5 flex flex-col p-4 border-none bg-gradient-to-r from-white/80 to-[#EAF4FF]/40 backdrop-blur-xs">
        <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
        <div className="w-full h-full flex gap-4 overflow-y-auto">
          {/* Left Sidebar - Tabs */}
          <div className="h-full w-1/4 border-r border-border">
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Right Content Area */}
          <div className="w-full h-full overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SettingsModal };