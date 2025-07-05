"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton = ({ onClick }: SettingsButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="cursor-pointer fixed bottom-6 right-6 h-8 w-8 transition-all duration-300 bg-background/80 backdrop-blur-sm"
      onClick={onClick}
    >
      <Settings className="h-5 w-5" />
    </Button>
  );
};

export { SettingsButton };