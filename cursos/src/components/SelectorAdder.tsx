import React, { useState, useRef } from "react";
import Icon from "@mdi/react";
import { mdiMenuDown, mdiClose, mdiPlus } from "@mdi/js";

interface SelectorProps {
  options: any[];
  selectValue: string;
  selectText: string;
  onSelect: (value: string) => void;
  handleDelete: (id: string) => void;
  handleAddNewCode: (newCode: string) => void;
  maxLength?: number; // Añade la propiedad para longitud máxima
  caseType?: "upper" | "lower" | "capitalize"; // Añade la propiedad para tipo de caso
}

export const SelectorAdder: React.FC<SelectorProps> = ({
  options,
  selectValue,
  selectText,
  onSelect,
  handleDelete,
  handleAddNewCode,
  maxLength = 10, // Valor predeterminado si no se pasa
  caseType = "upper", // Valor predeterminado si no se pasa
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setIsOpen(false);
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      handleAddNewCode(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Limitar la longitud del texto
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    // Filtrar caracteres permitidos (solo letras)
    const regex = /^[a-zA-Z]*$/;
    if (!regex.test(value)) {
      return; // Si el valor contiene caracteres no permitidos, no hacer nada
    }

    // Transformar el texto según el tipo de caso
    if (caseType === "upper") {
      value = value.toUpperCase();
    } else if (caseType === "lower") {
      value = value.toLowerCase();
    } else if (caseType === "capitalize") {
      value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    setInputValue(value);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full">
      <div
        className={`inline-flex w-full p-2 font-bold relative cursor-pointer justify-center`}
        onClick={() => setIsOpen(!isOpen)}
        id="menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {selectedValue || "Select a Code"}
        <Icon path={mdiMenuDown} size={0.8} />
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-full rounded-lg bg-white shadow-lg">
          <div className="relative p-2">
            <input
              type="text"
              className="w-full p-2 border rounded-lg pr-10"
              placeholder="CODE"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <div onClick={handleAdd}>
              <Icon
                path={mdiPlus}
                size={1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              />
            </div>
          </div>
          {options.map((option: any, index: any) => (
            <button
              key={option[selectValue]}
              onClick={() => handleSelect(option[selectText])}
              className={`flex items-center p-2 font-bold w-full justify-center ${
                selectedValue === option[selectValue]
                  ? "bg-gray-100"
                  : "text-gray-700"
              } hover:bg-gray-100 ${
                index === options.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              {option[selectText]}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(option[selectValue]);
                }}
                className="rounded-full p-[2px] bg-[#F7CDCD] text-[#D60707] cursor-pointer absolute right-2"
                style={{ border: "1px solid #D60707" }}
              >
                <Icon path={mdiClose} size={0.5} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
