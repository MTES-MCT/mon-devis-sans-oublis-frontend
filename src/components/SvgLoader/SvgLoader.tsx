"use client";

import { useState, useEffect } from "react";

export interface SVGLoaderProps {
  color?: string;
  height?: number;
  src: string | undefined;
  width?: number;
}

const SVGLoader = ({
  color = "currentColor",
  height = 56,
  src,
  width = 56,
}: SVGLoaderProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (src) {
      fetch(src)
        .then((res) => res.text())
        .then((data) => setSvgContent(data))
        .catch((err) => console.error("Erreur de chargement du SVG :", err));
    }
  }, [src]);

  if (!svgContent) return null;

  return (
    <div
      className="inline-block"
      data-testid="svg-container"
      dangerouslySetInnerHTML={{
        __html: svgContent.replace(/fill="[^"]*"/g, 'fill="currentColor"'),
      }}
      style={{
        color,
        height,
        width,
      }}
    />
  );
};

export default SVGLoader;
