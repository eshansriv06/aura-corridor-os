"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface VariableFontHoverProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number;
  className?: string;
  onClick?: () => void;
  isHovered?: boolean;
}

export function VariableFontHover({
  label,
  fromFontVariationSettings = "'wght' 400",
  toFontVariationSettings = "'wght' 700",
  staggerDuration = 0.03,
  staggerFrom = "center",
  className,
  onClick,
  isHovered: externalHovered,
}: VariableFontHoverProps) {
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;
  const characters = Array.from(label);

  const getDelay = (index: number) => {
    const total = characters.length;
    if (staggerFrom === "first") return index * staggerDuration;
    if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
    if (typeof staggerFrom === "number") return Math.abs(index - staggerFrom) * staggerDuration;
    const center = (total - 1) / 2;
    return Math.abs(index - center) * staggerDuration;
  };

  return (
    <span
      className={cn(
        "inline-flex items-center select-none cursor-pointer tracking-wide",
        className
      )}
      style={{
        fontFamily: "var(--font-inter), var(--font-ibm-sans), sans-serif",
      }}
      aria-label={label}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      onClick={onClick}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          aria-hidden="true"
          animate={{
            fontVariationSettings: isHovered ? toFontVariationSettings : fromFontVariationSettings,
            fontWeight: isHovered ? 700 : 400,
            y: isHovered ? -2 : 0,
            scale: isHovered ? 1.06 : 1,
          }}
          transition={{
            duration: 0.18,
            delay: isHovered ? getDelay(index) : 0,
            ease: [0.25, 1, 0.5, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
