"use client";

import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorRow = ({ label, value, onChange }: ColorRowProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Update input when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };

    if (isPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isPickerOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Validate hex color format
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    // Reset to current value if invalid
    if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setInputValue(value);
    }
  };

  const handleColorPickerChange = (color: string) => {
    setInputValue(color);
    onChange(color);
  };

  return (
    <div className="flex items-center justify-between">
      {/* Left: Label */}
      <div className="flex-1">
        <span className="text-sm font-medium">{label}</span>
      </div>
      
      {/* Right: Color preview and input */}
      <div className="flex items-center gap-3 overflow-visible">
        {/* Color Preview Circle */}
        <div className="relative" ref={pickerRef}>
          <button
            className="w-8 h-8 rounded-full border-2 border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            style={{ backgroundColor: value }}
            onClick={() => setIsPickerOpen(!isPickerOpen)}
          />
          
          {/* Color Picker Popup */}
          {isPickerOpen && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-background border border-border rounded-lg shadow-xl">
              <HexColorPicker 
                color={value} 
                onChange={handleColorPickerChange}
              />
            </div>
          )}
        </div>
        
        {/* RGB Input */}
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="#000000"
          className="w-24 text-xs font-mono"
          maxLength={7}
        />
      </div>
    </div>
  );
};

export { ColorRow };