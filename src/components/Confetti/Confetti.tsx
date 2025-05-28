"use client";

import { useEffect, useState } from "react";

const Confetti = () => {
  const [confetti, setConfetti] = useState<
    {
      color: string;
      delay: number;
      duration: number;
      left: number;
      shape: string;
    }[]
  >([]);

  useEffect(() => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-yellow-400",
      "bg-green-400",
      "bg-pink-500",
      "bg-purple-500",
    ];

    const shapes = [
      "w-2 h-4",
      "w-3 h-3 rounded-full",
      "w-4 h-2 rotate-45",
      "w-2 h-2 rounded-sm",
    ];

    setConfetti(
      Array.from({ length: 50 }, () => ({
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
        left: Math.random() * 100,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }))
    );
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
      {confetti.map((item, index) => (
        <div
          className={`absolute animate-confetti-fall ${item.color} ${item.shape}`}
          key={index}
          role="presentation"
          style={{
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            left: `${item.left}vw`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
