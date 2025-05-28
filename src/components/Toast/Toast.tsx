"use client";

import { useState, useEffect } from "react";

export interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(true);

    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  return (
    <div
      className={`fr-alert fr-alert--success transition-transform transform bg-white ${
        visible ? "translate-x-0" : "translate-x-[120%]"
      } `}
    >
      <p className="font-bold">{message}</p>
    </div>
  );
};

export default Toast;
