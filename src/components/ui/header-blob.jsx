// src/components/ui/header-blob.jsx
import React from "react";

export const HeaderBlob = ({ size = 32 }) => {
  return (
    <div
      className="relative flex items-center justify-center shrink-0 pointer-events-none select-none"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <style>{`
        @keyframes sphere-rotate {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 2px 4px 0 #ffffff inset,
              0 5px 8px 0 #34d399 inset,
              0 11px 16px 0 #059669 inset,
              0 18px 24px 0 #064e3b inset;
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 2px 4px 0 #ffffff inset,
              0 5px 6px 0 #10b981 inset,
              0 10px 14px 0 #047857 inset,
              0 16px 20px 0 #022c22 inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 2px 4px 0 #ffffff inset,
              0 5px 8px 0 #34d399 inset,
              0 11px 16px 0 #059669 inset,
              0 18px 24px 0 #064e3b inset;
          }
        }
        .sphere-loader {
          animation: sphere-rotate 2.2s linear infinite;
        }
      `}</style>
      <div className="w-full h-full rounded-full bg-transparent sphere-loader shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
    </div>
  );
};

export default HeaderBlob;
