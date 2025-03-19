'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const MenuPortal = ({ isOpen, items, position, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div 
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div 
        className="absolute divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-48"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {items}
      </div>
    </div>,
    document.body
  );
};

export default MenuPortal; 