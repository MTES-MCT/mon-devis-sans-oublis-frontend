import { render, screen } from "@testing-library/react";

import Confetti from "./Confetti";

describe("Confetti Component", () => {
  it("renders the correct number of confetti elements", () => {
    render(<Confetti />);

    const confettiElements = screen.getAllByRole("presentation");
    expect(confettiElements.length).toBe(50);
  });

  it("applies random shapes and colors to confetti", () => {
    render(<Confetti />);

    const confettiElements = screen.getAllByRole("presentation");

    const shapePatterns = [
      /w-2 h-4/,
      /w-3 h-3 rounded-full/,
      /w-4 h-2 rotate-45/,
      /w-2 h-2 rounded/,
    ];

    const colorPatterns = [
      /bg-red-500/,
      /bg-blue-500/,
      /bg-yellow-400/,
      /bg-green-400/,
      /bg-pink-500/,
      /bg-purple-500/,
    ];

    confettiElements.forEach((confetti) => {
      const className = confetti.className;

      const hasColor = colorPatterns.some((pattern) => pattern.test(className));
      const hasShape = shapePatterns.some((pattern) => pattern.test(className));

      expect(hasColor).toBe(true);
      expect(hasShape).toBe(true);
    });
  });

  it("confetti elements have random animation durations and delays", () => {
    render(<Confetti />);

    const confettiElements = screen.getAllByRole("presentation");

    confettiElements.forEach((confetti) => {
      const delay = confetti.style.animationDelay;
      const duration = confetti.style.animationDuration;

      const parsedDelay = parseFloat(delay);
      const parsedDuration = parseFloat(duration);

      expect(isNaN(parsedDuration)).toBe(false);
      expect(isNaN(parsedDelay)).toBe(false);
      expect(parsedDelay).toBeGreaterThanOrEqual(0);
      expect(parseFloat(delay)).toBeLessThanOrEqual(2);
      expect(parseFloat(duration)).toBeGreaterThanOrEqual(2);
      expect(parseFloat(duration)).toBeLessThanOrEqual(5);
    });
  });
});
