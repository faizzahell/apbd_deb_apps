import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import ReactDOM from "react-dom";

interface SearchableDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Pilih...",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const dropdownMenu = (
    <div
      ref={dropdownRef}
      className="absolute z-20 mt-2 w-full bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-lg p-2 max-h-72 overflow-y-auto"
      style={{
        top: coords.top,
        left: coords.left,
        width: coords.width,
        position: "absolute",
      }}
    >
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-200/60 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm text-gray-700 shadow-sm"
        />
      </div>

      {filtered.map((opt) => (
        <div
          key={opt.value}
          onClick={() => {
            onChange(opt.value);
            setOpen(false);
          }}
          className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
        >
          {opt.label}
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="px-3 py-2 text-sm text-gray-400">Tidak ada hasil</div>
      )}
    </div>
  );

  return (
    <div className="relative" ref={buttonRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full justify-between items-center px-4 py-2.5 border border-gray-200/60 rounded-xl bg-white/90 text-gray-700 shadow-sm"
      >
        <span>{options.find((o) => o.value === value)?.label || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180 text-cyan-500" : "text-gray-500"
          }`}
        />
      </button>

      {open && ReactDOM.createPortal(dropdownMenu, document.body)}
    </div>
  );
};

export default SearchableDropdown;
