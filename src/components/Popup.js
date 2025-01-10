import { useState, useEffect } from 'react';

export default function Popup({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="popup">
      <div className="popup-message">
        <p>{message}</p>
      </div>
    </div>
  );
}
