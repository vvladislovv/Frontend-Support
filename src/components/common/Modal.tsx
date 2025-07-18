import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="relative bg-white rounded p-6 w-full max-w-md mx-auto z-10 shadow-lg">
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}; 