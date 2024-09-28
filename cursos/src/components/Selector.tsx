import React, { useState, useRef, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiMenuDown } from "@mdi/js";

interface SelectorProps {
  options: any[];
  selectValue: string;
  selectText: string;
  border?: boolean;
  onSelect: (value: string) => void;
  defaultValue?: string;
}

export const Selector: React.FC<SelectorProps> = ({
  options,
  selectValue,
  selectText,
  border = true,
  onSelect,
  defaultValue = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (defaultValue && options.length > 0) {
      setSelectedValue(defaultValue);
      onSelect(defaultValue);
    }
  }, [defaultValue]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOptionText = (() => {
    const option = options.find(
      (option: any) => option[selectValue] === selectedValue
    );
    return option ? option[selectText] : "Select an option";
  })();

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full">
      <div
        className={`inline-flex w-full p-2 font-bold ${
          border ? "border justify-center" : "border-none justify-end"
        } rounded-lg relative cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        id="menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {selectedOptionText}
        <Icon
          path={mdiMenuDown}
          size={0.8}
          className={`${border ? "absolute right-2" : "block"}`}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-full rounded-lg bg-white shadow-lg">
          {options.map((option: any, index: any) => (
            <button
              key={option[selectValue]}
              onClick={() => handleSelect(option[selectValue])}
              className={`flex items-center p-2 font-bold w-full justify-center ${
                selectedValue === option[selectValue]
                  ? "bg-gray-100"
                  : "text-gray-700"
              } hover:bg-gray-100 ${
                index === 0
                  ? "rounded-t-lg"
                  : index === options.length - 1
                  ? "rounded-b-lg"
                  : ""
              }`}
            >
              {option.icon && (
                <Icon path={option.icon} size={1} className="mr-3 h-5 w-5" />
              )}
              {option[selectText]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
