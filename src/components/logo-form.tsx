"use client";

import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 48,
  className = "hidden lg:block",
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-current"
      >
        {/* Static circle */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />

        {/* Animated wire circle */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeDasharray="188.4"
          strokeDashoffset="188.4"
          style={{
            animation: "dashLoop 2s linear infinite",
          }}
        />

        {/* K Letter */}
        <text
          x="32"
          y="40"
          textAnchor="middle"
          fontSize="28"
          fontFamily="sans-serif"
          fontWeight="bold"
          fill="currentColor"
        >
          K
        </text>
      </svg>

      {/* Inline animation */}
      <style jsx>{`
        @keyframes dashLoop {
          0% {
            stroke-dashoffset: 188.4;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};
