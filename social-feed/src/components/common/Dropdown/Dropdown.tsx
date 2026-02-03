import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactElement;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  position?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  options,
  onSelect,
  position = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown__trigger" onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`dropdown__menu dropdown__menu--${position}`}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`dropdown__item ${
                option.danger ? 'dropdown__item--danger' : ''
              } ${option.disabled ? 'dropdown__item--disabled' : ''}`}
              onClick={() => handleSelect(option)}
              disabled={option.disabled}
            >
              {option.icon && <span className="dropdown__icon">{option.icon}</span>}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};