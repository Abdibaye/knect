// import ResourcesPage from "@/components/resource/resources";
// import React from "react";

// const Resource = () => {
//   return <ResourcesPage />;
// };

// export default Resource;
"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
  src?: string; // image path under /public
}

export const Logo: React.FC<LogoProps> = ({
  size = 48,
  className = " lg:block",
  src = "/branding/brain-logo.jpg",
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative ${className}`}
    >
      {/* Image as circular logo */}
      <Image
        src={src}
        alt="Logo"
        width={size}
        height={size}
        className="w-full h-full object-cover rounded-full"
        priority
      />

      {/* Animated ring overlay */}
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full text-current pointer-events-none"
      >
        {/* outer static stroke */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        {/* animated stroke */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeDasharray="188.4"
          strokeDashoffset="188.4"
          style={{ animation: "dashLoop 2s linear infinite" }}
        />
      </svg>

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
