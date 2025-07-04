"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Palette, Info } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "color" | "about";

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("color");

  const tabs = [
    { id: "color" as TabType, label: "Color", icon: Palette },
    { id: "about" as TabType, label: "About", icon: Info },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "color":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">🎨 Color Customization</h3>
              <div className="text-center text-muted-foreground py-8">
                Color customization options coming soon...
              </div>
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">ℹ️ About Flash Fingers</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Version: 1.0.0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    A minimalist typing speed test designed to help you improve your typing skills 
                    while maintaining focus and flow.
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    Built with Next.js, React, and shadcn/ui for a modern, accessible typing experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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