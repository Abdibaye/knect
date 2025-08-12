"use client";

import React from "react";

type LogoProps = {
  size?: number;
  className?: string;
  color?: string; // main neon color
  bgStroke?: string; // subtle background stroke
  animate?: boolean; // orbit animation
  glow?: boolean; // outer glow
};

export const Logo: React.FC<LogoProps> = ({
  size = 64,
  className = "",
  color = "#7CF9F1",
  bgStroke = "rgba(124, 249, 241, 0.25)",
  animate = true,
  glow = true,
}) => {
  return (
    <div
      className={className}
      style={{ width: size, height: size, lineHeight: 0 }}
      aria-label="Knect Logo"
    >
      <svg
        viewBox="0 0 256 256"
        width={size}
        height={size}
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#BFFCF8" />
          </linearGradient>

          {/* soft glow */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="12" in="blur1" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Optional halo */}
        {glow && (
          <ellipse
            cx="128"
            cy="132"
            rx="94"
            ry="34"
            fill="none"
            stroke={bgStroke}
            strokeWidth="6"
            filter="url(#softGlow)"
          />
        )}

        {/* Orbit ring */}
        <g
          transform="translate(128 132)"
          style={{ transformOrigin: "128px 132px" }}
        >
          <ellipse
            cx="0"
            cy="0"
            rx="92"
            ry="28"
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="12 10"
          >
            {animate && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="6s"
                repeatCount="indefinite"
              />
            )}
          </ellipse>
        </g>

        {/* Brain silhouette (stylized) */}
        <g filter={glow ? "url(#softGlow)" : undefined}>
          {/* Outer brain outline */}
          <path
            d="
              M92,66
              C76,66,64,78,64,94
              C48,96,38,110,40,126
              C28,138,28,158,40,170
              C44,196,68,206,88,198
              C94,210,110,216,124,212
              C136,224,160,224,172,212
              C192,220,216,206,212,184
              C226,170,226,146,212,134
              C216,120,210,104,196,98
              C196,82,184,70,168,70
              C160,60,144,56,132,62
              C120,54,102,56,92,66 Z
            "
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Fissures/gyri lines */}
          <path
            d="M84,122 C96,110 112,108 126,116"
            fill="none"
            stroke={color}
            strokeOpacity="0.9"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M126,116 C146,106 170,110 182,124"
            fill="none"
            stroke={color}
            strokeOpacity="0.9"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M90,142 C106,132 130,132 146,142"
            fill="none"
            stroke={color}
            strokeOpacity="0.9"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M96,160 C112,150 136,150 156,160"
            fill="none"
            stroke={color}
            strokeOpacity="0.85"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M108,92 C118,88 138,88 150,96"
            fill="none"
            stroke={color}
            strokeOpacity="0.8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Brain stem */}
          <path
            d="M148,178 C150,190 144,198 134,202 C128,206 120,204 116,198"
            fill="none"
            stroke={color}
            strokeOpacity="0.9"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* Monogram "K" in the center */}
        <g pointerEvents="none">
          {/* soft glow fill */}
          <text
            x="128"
            y="132"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="88"
            fontWeight="800"
            fill={color}
            opacity="0.18"
            filter="url(#softGlow)"
          >
            K
          </text>
          {/* bright outline */}
          <text
            x="128"
            y="132"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="88"
            fontWeight="800"
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth="6"
            strokeLinejoin="round"
            style={{ paintOrder: "stroke fill" }}
            filter="url(#softGlow)"
          >
            K
          </text>
        </g>
      </svg>
    </div>
  );
};
