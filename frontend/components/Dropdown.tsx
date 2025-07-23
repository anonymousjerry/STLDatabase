'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface DropdownButtonProps {
  initialContent: string;
  label: string;
  list: string[];
  onSelect?: (item: string) => void; // optional callback
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  initialContent,
  label,
  list,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialContent);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: string) => {
    setSelected(item);
    setOpen(false);
    if (onSelect) onSelect(item);
  };

  return (
    <div className=" flex-col flex relative w-full text-left " ref={dropdownRef}>
      {/* Label */}
      <div className="text-custom-light-textcolor  text-left font-['Inter-SemiBold',_sans-serif] text-lg font-semibold relative self-stretch">{label}</div>

      {/* Dropdown button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-white  rounded-xl border-solid border-[#4e4d80]  border pt-3 pr-2.5 pb-3 pl-2.5 flex flex-row items-center justify-between shrink-0  h-12 relative"
      >
        <span className="text-left font-['Inter-Medium',_sans-serif] text-lg font-medium relative">{selected}</span>
        <span
          className={`text-sm transform transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
  <div
    className={`
      absolute left-0 mt-[78px] bg-white  border rounded shadow-lg z-10 text-black
      transition-all duration-200 ease-out
      opacity-100 scale-100
      origin-top
    `}
  >
    <ul
      className="py-2 max-h-60 overflow-auto whitespace-nowrap"
    >
      {list.map((item) => (
        <li
          key={item}
          onClick={() => handleSelect(item)}
          className="px-4 py-2 hover:bg-gray-100  cursor-pointer"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
};

export default DropdownButton;